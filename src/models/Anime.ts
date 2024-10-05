export interface AnimeData {
    animeId: number,
    malId: number,
    animeName: string,
    aliases: AnimeAliasData[]
}

export interface AnimeFlattenedData {
    animeId: number,
    malId: number,
    alias: string,
    language: string
}

export interface AnimeAliasData {
    animeId: number,
    alias: string,
    language: string
}

export interface AnimeResponse {
    animeData: AnimeData[]
}
