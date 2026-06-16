export const MOEDAS_POR_SEMESTRE = 1000;

/** Formato: "2026-1" (jan–jun) ou "2026-2" (jul–dez) */
export function getSemestreAtual(): string {
  const now = new Date();
  const periodo = now.getMonth() < 6 ? 1 : 2;
  return `${now.getFullYear()}-${periodo}`;
}
