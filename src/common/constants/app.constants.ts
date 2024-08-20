
export enum STAR_WARS_CATEGORY {
    PEOPLE = 'people',
    STARSHIPS = 'starships',
    PLANETS = 'planets',
    FILMS = 'films'
  }

export const ENTITY_NAMES: Array<STAR_WARS_CATEGORY> = Object.values(STAR_WARS_CATEGORY);

export const LEVEL_LOGS = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
};