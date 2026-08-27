export interface Origin {
  country: string
  flag: string
  cities: string[]
}

export const ORIGINS: Origin[] = [
  { country: 'Puerto Rico', flag: '🇵🇷', cities: ['San Juan', 'Carolina', 'Bayamón', 'Ponce'] },
  { country: 'Colombia', flag: '🇨🇴', cities: ['Medellín', 'Bogotá', 'Cali', 'Barranquilla'] },
  { country: 'República Dominicana', flag: '🇩🇴', cities: ['Santo Domingo', 'Santiago'] },
  { country: 'Panamá', flag: '🇵🇦', cities: ['Ciudad de Panamá', 'Colón'] },
  { country: 'Venezuela', flag: '🇻🇪', cities: ['Caracas', 'Maracaibo'] },
  { country: 'México', flag: '🇲🇽', cities: ['Ciudad de México', 'Monterrey', 'Tijuana'] },
  { country: 'España', flag: '🇪🇸', cities: ['Madrid', 'Barcelona'] },
  { country: 'Argentina', flag: '🇦🇷', cities: ['Buenos Aires', 'Rosario'] },
  { country: 'Chile', flag: '🇨🇱', cities: ['Santiago'] },
  { country: 'Estados Unidos', flag: '🇺🇸', cities: ['Miami', 'Nueva York'] },
  { country: 'Otro', flag: '🏳️', cities: ['Ciudad sin nombre'] },
]
