export interface AnimeData {
    animeId: number,
    MALId: number,
    aliases: AnimeAliasData[]
}

export interface AnimeFlattenedData {
    animeId: number,
    MALId: number,
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