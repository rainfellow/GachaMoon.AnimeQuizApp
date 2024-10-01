import React, { createContext, useCallback, useEffect, useState } from "react";
import type { ReactElement } from "react";
import { AnimeData, AnimeFlattenedData, AnimeResponse } from "@/models/Anime";
import { useAxios } from "@/hooks/use-axios";
import { AxiosResponse } from "axios";

export interface IAnimeContext {
    animes: AnimeData[] | undefined
    animeLoaded: boolean;
    animeNames: string[] | undefined
    getAllAnimeNames: () => string[] | undefined
    getAnimeIdFromName: (name: string) => number | undefined
    loadAnimes: () => Promise<void> | undefined
}

export const AnimeContext = createContext<IAnimeContext>({
    animes: undefined,
    animeLoaded: false,
    animeNames: undefined,
    getAllAnimeNames: () => { return undefined },
    getAnimeIdFromName: (name: string) => { return undefined },
    loadAnimes: () => { return undefined }
});

interface AnimeContextProviderProps {
    children: React.ReactNode;
}

export const AnimeContextProvider: React.FC<AnimeContextProviderProps> = ({
    children
}: AnimeContextProviderProps): ReactElement => {
    const [animes, setAnimes] = useState<AnimeData[] | undefined>(undefined);
    const [animeLoaded, setAnimeLoaded] = useState<boolean>(false);
    const [animesFlattened, setAnimesFlattened] = useState<AnimeFlattenedData[] | undefined>(undefined);
    const [animeNames, setAnimeNames] = useState<string[] | undefined>(undefined);

    const axios = useAxios();

    const contextValue = {
        animes,
        animeLoaded,
        animeNames,
        getAllAnimeNames: useCallback(() => {
            return animeNames;
        }, []),
        getAnimeIdFromName: useCallback((name: string) => {
            var result = animesFlattened?.find((value) => value.alias === name);
            return result?.animeId;
        }, []),
        loadAnimes: useCallback(async () => {
            axios.get("/Quiz/animes/all").then((res: AxiosResponse<AnimeResponse>) => {
                let animesData: AnimeData[] = res.data.animeData;
                console.log(animesData.length)
                setAnimes(animesData);
                setAnimesFlattened(animesData.flatMap((anime) => anime.aliases.map((animeAlias) => ({ animeId: animeAlias.animeId, MALId: anime.MALId, alias: animeAlias.alias, language: animeAlias.language }))));
                setAnimeNames(animesData.flatMap((anime) => anime.aliases.map((animeAlias) => (animeAlias.alias))));
            }).catch((e) => { console.log("error during anime list fetching: " + e)}).finally(() => setAnimeLoaded(true));
        }, []),
    };
    return (
        <AnimeContext.Provider value={contextValue}>
            {children}
        </AnimeContext.Provider>
    );
};
