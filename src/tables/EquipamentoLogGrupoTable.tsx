import { Box, Typography, Chip, Alert, Tooltip, useMediaQuery, useTheme, CircularProgress } from "@mui/material";
import { DataGrid, type GridColDef, type GridRenderCellParams, type GridPaginationModel } from "@mui/x-data-grid";
import { useDispatch } from "react-redux";
import { setFeedback } from "../redux/slices/feedBackSlice";
import EquipamentoLogService from "../services/equipamentoLogService";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { tableStyles } from "../styles";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WarningIcon from "@mui/icons-material/Warning";
// import LogsCardView from "../components/logs/LogsCardView";
import { parseTimestampAsLocal } from "../utils/dateUtils";

/** `false` desativa o polling incremental (afterGroupId) a cada 10s. */
const EQUIPAMENTO_LOG_GRUPO_AUTO_REFRESH_ENABLED = true;
const AUTO_REFRESH_INTERVAL_MS = 10_000;

/** Junta linhas novas (ids inexistentes) e ordena por timestamp desc; desempate por id. */
function mergeNewerLogRows(current: any[], incoming: any[]): any[] {
    const existingIds = new Set(current.map((r) => r.id));
    const toAdd = incoming.filter((r) => !existingIds.has(r.id));
    if (!toAdd.length) return current;
    return [...toAdd, ...current].sort((a, b) => {
        const tb = new Date(b.timestamp).getTime();
        const ta = new Date(a.timestamp).getTime();
        if (tb !== ta) return tb - ta;
        return (b.id ?? 0) - (a.id ?? 0);
    });
}

interface PaginationMeta {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}

interface TableData {
    columns: GridColDef[];
    rows: any[];
    situation?: 'working' | 'frozen';
    metrics: any[];
    pagination?: PaginationMeta;
}

export interface EquipamentoLogGrupoTableProps {
    /** Id do equipamento na rota — vem do pai para permitir React.memo estável. */
    equipamentoId: string;
}

function EquipamentoLogGrupoTable({ equipamentoId }: EquipamentoLogGrupoTableProps) {
    const dispatch = useDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [columns, setColumns] = useState<GridColDef[]>([]);
    const [rows, setRows] = useState<any[]>([]);
    /** Só o primeiro carregamento (ou após trocar `id`); paginação não usa overlay. */
    const [initialLoading, setInitialLoading] = useState(true);
    const hasCompletedInitialLoadRef = useRef(false);
    /** Id do grupo mais recente já conhecido (cursor para `afterGroupId` no backend). Só confiável na página 0. */
    const lastNewestGroupIdRef = useRef<number | null>(null);
    const [isAutoRefreshing, setIsAutoRefreshing] = useState(false);
    const [situation, setSituation] = useState<'working' | 'frozen' | null>(null);
    const [rowCount, setRowCount] = useState(0);
    const [metrics, setMetrics] = useState<any[]>([]);

    // Paginação: padrão 10; opções 10 / 20 / 30
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
        page: 0,
        pageSize: 10
    });
    const [cardPage, setCardPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const paginationModelRef = useRef<GridPaginationModel>(paginationModel);

    useEffect(() => {
        paginationModelRef.current = paginationModel;
    }, [paginationModel]);

    useEffect(() => {
        hasCompletedInitialLoadRef.current = false;
        lastNewestGroupIdRef.current = null;
        setInitialLoading(true);
    }, [equipamentoId]);

    // Componente para renderizar célula com alerta
    const MetricCell = (params: GridRenderCellParams) => {
        const { value, field, row } = params;
        const alertField = `${field}_alert`;

        const alert = row[alertField] as 'min' | 'max' | 'none';

        if (alert && alert !== 'none') {
            const isMaxAlert = alert === 'max';
            const message = isMaxAlert ? 'Valor muito próximo ou igual ao máximo permitido' : 'Valor muito próximo ou igual ao mínimo permitido';

            return (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'end' }}>
                    <Tooltip title={message}>
                        <WarningIcon
                            sx={{
                                fontSize: 16,
                                color: isMaxAlert ? 'error.main' : 'error.main'
                            }}
                        />
                    </Tooltip>
                    <Typography
                        variant="body2"
                        sx={{
                            color: isMaxAlert ? 'error.main' : 'warning.main',
                            fontWeight: 'bold'
                        }}
                    >
                        {value}
                    </Typography>
                </Box>
            );
        }

        return <Typography variant="body2">{value}</Typography>;
    };


    const fetchTableData = useCallback(async (model?: GridPaginationModel) => {
        if (!equipamentoId) {
            setInitialLoading(false);
            return;
        }

        const currentPagination = model ?? paginationModelRef.current;
        const isInitialLoad = !hasCompletedInitialLoadRef.current;

        try {
            const tableData: TableData = await EquipamentoLogService.getLogsTableData(Number(equipamentoId), {
                page: currentPagination.page + 1,
                pageSize: currentPagination.pageSize
            });
            // Ensure columns have proper formatting for DataGrid
            const formattedColumns: GridColDef[] = tableData.columns.map(col => {
                const baseColumn = {
                    ...col,
                    sortable: true,
                    filterable: true,
                    resizable: true,
                };

                // Add valueGetter for dateTime columns to convert string to Date
                // Trata o timestamp como hora local para evitar conversão de timezone
                if (col.type === 'dateTime') {
                    return {
                        ...baseColumn,
                        valueGetter: (value: any) => {
                            return parseTimestampAsLocal(value);
                        }
                    };
                }

                // Add custom renderCell for metric columns to show alerts
                if (col.field?.startsWith('metrica_')) {
                    return {
                        ...baseColumn,
                        renderCell: MetricCell
                    };
                }

                return baseColumn;
            });

            setColumns(formattedColumns);
            setRows(tableData.rows || []);
            setSituation(tableData.situation ?? null);
            setMetrics(tableData.metrics || []);
            setRowCount(tableData.pagination?.totalItems ?? tableData.rows?.length ?? 0);

            if (currentPagination.page === 0) {
                const first = tableData.rows?.[0];
                lastNewestGroupIdRef.current = typeof first?.id === "number" ? first.id : null;
            }

            if (tableData.pagination) {
                setTotalPages(tableData.pagination.totalPages);
                const serverModel: GridPaginationModel = {
                    page: Math.max(tableData.pagination.page - 1, 0),
                    pageSize: tableData.pagination.pageSize
                };

                if (
                    serverModel.page !== paginationModel.page ||
                    serverModel.pageSize !== paginationModel.pageSize
                ) {
                    setPaginationModel(serverModel);
                    setCardPage(tableData.pagination.page);
                }
            }
        } catch (error: any) {
            dispatch(
                setFeedback({
                    message: `Erro ao buscar logs do equipamento: ${error.message}`,
                    type: "error",
                })
            );
        } finally {
            if (isInitialLoad) {
                setInitialLoading(false);
                hasCompletedInitialLoadRef.current = true;
            }
        }
    }, [equipamentoId, dispatch]);

    const fetchIncrementalNewer = useCallback(async () => {
        if (!equipamentoId) return;
        if (paginationModelRef.current.page !== 0) return;

        const newestId = lastNewestGroupIdRef.current;
        if (newestId == null) return;

        setIsAutoRefreshing(true);
        try {
            const tableData: TableData = await EquipamentoLogService.getLogsTableData(Number(equipamentoId), {
                afterGroupId: newestId,
                pageSize: paginationModelRef.current.pageSize,
            });
            const incoming = tableData.rows || [];
            if (incoming.length === 0) {
                return;
            }

            setRows((prev) => {
                const merged = mergeNewerLogRows(prev, incoming);
                lastNewestGroupIdRef.current = merged[0]?.id ?? lastNewestGroupIdRef.current;
                const pageSize = paginationModelRef.current.pageSize;
                return merged.slice(0, pageSize);
            });
            setSituation(tableData.situation ?? null);
            if (tableData.pagination?.totalItems != null) {
                setRowCount(tableData.pagination.totalItems);
            }
        } catch (error: any) {
            dispatch(
                setFeedback({
                    message: `Erro ao buscar registros novos: ${error?.message ?? error}`,
                    type: "error",
                })
            );
        } finally {
            setIsAutoRefreshing(false);
        }
    }, [equipamentoId, dispatch]);

    useEffect(() => {
        fetchTableData();

        if (!EQUIPAMENTO_LOG_GRUPO_AUTO_REFRESH_ENABLED) {
            return;
        }

        const interval = setInterval(() => {
            void fetchIncrementalNewer();
        }, AUTO_REFRESH_INTERVAL_MS);
        return () => {
            clearInterval(interval);
        };
    }, [fetchTableData, fetchIncrementalNewer]);

    // Handler para mudança de página nos cards
    const handleCardPageChange = useCallback((newPage: number) => {
        setCardPage(newPage);
        const newPaginationModel: GridPaginationModel = {
            page: newPage - 1,
            pageSize: paginationModel.pageSize
        };
        setPaginationModel(newPaginationModel);
        fetchTableData(newPaginationModel);
    }, [paginationModel.pageSize]);

    return (
        <Box
            sx={{
                height: "100%",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 1,
            }}
        >
            {/* Alerta de situação "frozen" */}
            {situation === 'frozen' && (
                <Alert
                    severity="warning"
                    variant="outlined"
                    sx={{
                        mb: 1,
                        fontSize: isMobile ? '0.875rem' : '1rem',
                        '& .MuiAlert-message': {
                            fontSize: isMobile ? '0.875rem' : '1rem',
                        }
                    }}
                >
                    Equipamento sem variação nas últimas 5 leituras. Verifique possíveis falhas de leitura.
                </Alert>
            )}

            {/* Indicador de auto-refresh — só com EQUIPAMENTO_LOG_GRUPO_AUTO_REFRESH_ENABLED */}
            {EQUIPAMENTO_LOG_GRUPO_AUTO_REFRESH_ENABLED && (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1,
                        flexWrap: isMobile ? 'wrap' : 'nowrap',
                    }}
                >
                    <Chip
                        icon={<AccessTimeIcon />}
                        label={
                            isMobile
                                ? "Novos: 10s"
                                : "Novos registros a cada 10s"
                        }
                        variant="outlined"
                        size={isMobile ? "small" : "medium"}
                        color="primary"
                        sx={{
                            fontSize: isMobile ? '0.75rem' : '0.875rem',
                        }}
                    />
                    {isAutoRefreshing && (
                        <Typography
                            variant="caption"
                            color="primary"
                            sx={{
                                fontStyle: "italic",
                                fontSize: isMobile ? '0.7rem' : '0.75rem',
                            }}
                        >
                            Atualizando...
                        </Typography>
                    )}
                </Box>
            )}

            {/* Carregamento inicial: mesmo CircularProgress no mobile e desktop */}
            {initialLoading ? (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: isMobile ? 280 : 360,
                        width: "100%",
                    }}
                >
                    <CircularProgress />
                </Box>
            ) : isMobile ? (
                <></>
            ) : (
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        rowHeight={40}
                        sx={tableStyles}
                        loading={false}
                        getRowId={(row) => row.id}
                        paginationMode="server"
                        paginationModel={paginationModel}
                        onPaginationModelChange={(model) => {
                            setPaginationModel(model);
                            fetchTableData(model);
                        }}
                        rowCount={rowCount}
                        checkboxSelection={false}
                        pageSizeOptions={[10, 20, 30]}
                        disableRowSelectionOnClick
                        hideFooter={false}
                        autoHeight={false}
                        density="compact"
                        disableColumnMenu={false}
                        sortingMode="client"
                        filterMode="client"
                    />
            )}
        </Box>
    );
}

export default memo(EquipamentoLogGrupoTable);

/*
 * ─── Safe-delete: polling antigo (refetch completo a cada 10s). Hoje: fetchIncrementalNewer + afterGroupId. ───
 */
