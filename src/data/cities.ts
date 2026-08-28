/**
 * Where an artist lives. Light model: you start in a city in your home country
 * and, once you break internationally, move to the hub — one-way, one move.
 */

export const INTERNATIONAL_HUB = 'Miami'

/** internationalReach at which the artist relocates to the hub. */
export const RELOCATE_REACH = 35

const HOME_CITY_BY_COUNTRY: Record<string, string> = {
  'Puerto Rico': 'San Juan',
  Colombia: 'Medellín',
  'República Dominicana': 'Santo Domingo',
  Panamá: 'Ciudad de Panamá',
  Venezuela: 'Caracas',
  México: 'Ciudad de México',
  España: 'Madrid',
  Argentina: 'Buenos Aires',
  Chile: 'Santiago',
  'Estados Unidos': 'Nueva York',
}

export function homeCity(country: string): string {
  return HOME_CITY_BY_COUNTRY[country] ?? 'tu ciudad'
}
