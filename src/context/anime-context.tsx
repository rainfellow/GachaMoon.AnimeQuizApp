import React, { createContext, useCallback, useEffect, useState } from "react";
import type { ReactElement } from "react";
import { AnimeData, AnimeFlattenedData, AnimeResponse, UserAnimeListData } from "@/models/Anime";
import { useAxios } from "@/hooks/use-axios";

export interface IAnimeContext {
    animes: AnimeData[] | undefined
    animeLoaded: boolean;
    animeNames: string[] | undefined
    animesFlattened: AnimeFlattenedData[] | undefined
    userAnimeList: UserAnimeListData | undefined
    setAnimes: (animes: AnimeData[] | undefined) => void
    setAnimeLoaded: (animeLoaded: boolean) => void
    setAnimeNames: (animeNames: string[] | undefined) => void
    setAnimesFlattened: (animesFlattened: AnimeFlattenedData[] | undefined) => void
    setUserAnimeList: (userAnimeList: UserAnimeListData | undefined) => void
}

export const AnimeContext = createContext<IAnimeContext>({
    animes: undefined,
    animeLoaded: false,
    animeNames: undefined,
    animesFlattened: undefined,
    userAnimeList: undefined,
    setAnimes: (animes: AnimeData[] | undefined) => {},
    setAnimeLoaded: (animeLoaded: boolean) => {},
    setAnimeNames: (animeNames: string[] | undefined) => {},
    setAnimesFlattened: (animesFlattened: AnimeFlattenedData[] | undefined) => {},
    setUserAnimeList: (userAnimeList: UserAnimeListData | undefined) =>  {}
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
    const [userAnimeList, setUserAnimeList] = useState<UserAnimeListData | undefined>(undefined);

    const axios = useAxios();

    const contextValue = {
        animes,
        animeLoaded,
        animeNames,
        animesFlattened,
        userAnimeList,
        setAnimes: useCallback((animes: AnimeData[] | undefined) => {
            setAnimes(animes);
        }, []),
        setAnimeLoaded: useCallback((animeLoaded: boolean) => {
            setAnimeLoaded(animeLoaded);
        }, []),
        setAnimeNames: useCallback((animeNames: string[] | undefined) => {
            setAnimeNames(animeNames);
        }, []),
        setAnimesFlattened: useCallback((animesFlattened: AnimeFlattenedData[] | undefined) => {
            setAnimesFlattened(animesFlattened);
        }, []),
        setUserAnimeList: useCallback((userAnimeList: UserAnimeListData | undefined) => {
            setUserAnimeList(userAnimeList);
        }, []),
    };
    return (
        <AnimeContext.Provider value={contextValue}>
            {children}
        </AnimeContext.Provider>
    );
};
