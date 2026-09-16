// Constantes del programa de recompensas — sin dependencias de servidor, para
// que tanto db.ts como los componentes cliente puedan importarlas.

/** Niveles del programa de recompensas, según puntos acumulados en la vida del cliente. */
export const REWARD_TIERS = [
  { label: "Bronce", min: 0 },
  { label: "Plata", min: 10 },
  { label: "Oro", min: 25 },
] as const;

export function getRewardTier(rewardLifetime: number) {
  let tier: (typeof REWARD_TIERS)[number] = REWARD_TIERS[0];
  for (const t of REWARD_TIERS) {
    if (rewardLifetime >= t.min) tier = t;
  }
  return tier;
}
