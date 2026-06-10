export type TimeoutOnlineUnit = 'segundos' | 'minutos' | 'horas' | 'dias';

export const TIMEOUT_ONLINE_UNIT_OPTIONS: { value: TimeoutOnlineUnit; label: string }[] = [
  { value: 'segundos', label: 'Segundos' },
  { value: 'minutos', label: 'Minutos' },
  { value: 'horas', label: 'Horas' },
  { value: 'dias', label: 'Dias' },
];

export const MAX_TIMEOUT_ONLINE_SEGUNDOS = 86400;

const UNIT_TO_SECONDS: Record<TimeoutOnlineUnit, number> = {
  segundos: 1,
  minutos: 60,
  horas: 3600,
  dias: 86400,
};

export function convertToTimeoutSeconds(
  value: number,
  unit: TimeoutOnlineUnit
): number {
  return value * UNIT_TO_SECONDS[unit];
}

export function secondsToTimeoutDisplay(seconds: number): {
  value: number;
  unit: TimeoutOnlineUnit;
} {
  if (seconds >= 86400 && seconds % 86400 === 0) {
    return { value: seconds / 86400, unit: 'dias' };
  }
  if (seconds >= 3600 && seconds % 3600 === 0) {
    return { value: seconds / 3600, unit: 'horas' };
  }
  if (seconds >= 60 && seconds % 60 === 0) {
    return { value: seconds / 60, unit: 'minutos' };
  }
  return { value: seconds, unit: 'segundos' };
}

export function getMaxValueForUnit(unit: TimeoutOnlineUnit): number {
  return Math.floor(MAX_TIMEOUT_ONLINE_SEGUNDOS / UNIT_TO_SECONDS[unit]);
}
