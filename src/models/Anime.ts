export interface AnimeData {
    animeId: number,
    malId: number,
    animeName: string,
    ageRating: string,
    meanScore: number,
    releaseDate: string,
    episodeCount: number,
    animeType: string,
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
    language: string,
    aliasId: number
}

export interface AnimeResponse {
    animeData: AnimeData[]
}
