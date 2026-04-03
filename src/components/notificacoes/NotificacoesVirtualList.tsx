import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Box, ListItem, ListItemText, Chip, Button } from "@mui/material";
import type { Notificacao } from "../../types/Notificacao";

type NotificacoesVirtualListProps = {
  notificacoes: Notificacao[];
  onMarkAsRead: (id: number) => void;
};

/**
 * Lista virtualizada com @tanstack/react-virtual: só monta linhas visíveis (+ overscan).
 * `measureElement` + altura estimada tratam textos de tamanho variável.
 */
export default function NotificacoesVirtualList({
  notificacoes,
  onMarkAsRead,
}: NotificacoesVirtualListProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: notificacoes.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120,
    overscan: 8,
  });

  return (
    <Box
      ref={parentRef}
      sx={{
        flex: 1,
        minHeight: 0,
        overflow: "auto",
        width: "100%",
      }}
    >
      <Box
        sx={{
          height: virtualizer.getTotalSize(),
          width: "100%",
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const notificacao = notificacoes[virtualRow.index];
          return (
            <Box
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${virtualRow.start}px)`,
                boxSizing: "border-box",
              }}
            >
              <ListItem
                sx={{
                  bgcolor: notificacao.visualizado ? "transparent" : "action.hover",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  py: 2,
                  borderBottom: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 1,
                  }}
                >
                  <Chip
                    label={notificacao.visualizado ? "Visualizada" : "Nova"}
                    size="small"
                    color={notificacao.visualizado ? "default" : "error"}
                    sx={{ fontSize: "0.7rem" }}
                  />
                  {!notificacao.visualizado && (
                    <Button size="small" onClick={() => onMarkAsRead(notificacao.id)}>
                      Marcar como lida
                    </Button>
                  )}
                </Box>
                <ListItemText
                  primary={notificacao.descricao}
                  secondary={
                    notificacao.created_at
                      ? new Date(notificacao.created_at).toLocaleString("pt-BR")
                      : ""
                  }
                  primaryTypographyProps={{
                    sx: {
                      fontSize: "0.9rem",
                      fontWeight: notificacao.visualizado ? 400 : 600,
                    },
                  }}
                  secondaryTypographyProps={{
                    sx: { fontSize: "0.75rem", mt: 0.5 },
                  }}
                />
              </ListItem>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
