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

export interface UserAnimeListData {
    animeListServiceProvider: string;
    userAnimes: UserAnimeData[];
    selectedAnimeGroups: string[];
    animeListUserId: string
}

export interface UserAnimeData {
    id: number;
    score: number;
}

export const GetAllAnimeGenres = () => {
    return ["Action", "Adventure", "Comedy", "Drama", "Ecchi", "Fantasy", "Horror", "Hentai", "Mahou Shoujo", "Mecha", "Music", "Mystery", "Psychological", "Romance", "Sci-Fi", "Slice of Life", "Sports", "Supernatural", "Thriller"];
}