import React, { createContext, useCallback, useEffect, useState } from "react";
import type { ReactElement } from "react";
import { AnimeData, AnimeFlattenedData, AnimeResponse } from "@/models/Anime";
import { useAxios } from "@/hooks/use-axios";
import { AxiosResponse } from "axios";

export interface IAnimeContext {
    animes: AnimeData[] | undefined
    animeLoaded: boolean;
    animeNames: string[] | undefined
    animesFlattened: AnimeFlattenedData[] | undefined
    loadAnimes: () => Promise<void> | undefined
}

export const AnimeContext = createContext<IAnimeContext>({
    animes: undefined,
    animeLoaded: false,
    animeNames: undefined,
    animesFlattened: undefined,
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
        animesFlattened,
        loadAnimes: useCallback(async () => {
            axios.get("/Quiz/animes/all").then((res: AxiosResponse<AnimeResponse>) => {
                let animesData: AnimeData[] = res.data.animeData;
                setAnimes(animesData);
                let flattenedAnimes = animesData.flatMap((anime) => anime.aliases.map((animeAlias) => ({ animeId: anime.animeId, MALId: anime.MALId, alias: animeAlias.alias, language: animeAlias.language })));
                setAnimesFlattened(flattenedAnimes);
                let animeNames = flattenedAnimes.map((anime) => (anime.alias));
                setAnimeNames(animeNames);
            }).catch((e) => { console.log("error during anime list fetching: " + e)}).finally(() => setAnimeLoaded(true));
        }, []),
    };
    return (
        <AnimeContext.Provider value={contextValue}>
            {children}
        </AnimeContext.Provider>
    );
};
