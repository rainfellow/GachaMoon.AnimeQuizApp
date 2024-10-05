import { useContext } from "react";
import { AnimeContext } from "@/context/anime-context";
import { useAxios } from "./use-axios";
import { AxiosResponse } from "axios";
import { AnimeData, AnimeResponse } from "@/models/Anime";

export interface IAnimeBase {
    getAnimeIdFromName: (name: string) => number | undefined
    getAnimeNameFromId: (id: number) => string | undefined
    loadAnimes: () => Promise<void>
}

export const useAnimeBase = (): IAnimeBase => {
    const { animeLoaded, animes, animeNames, animesFlattened, setAnimeLoaded, setAnimeNames, setAnimes, setAnimesFlattened } = useContext(AnimeContext);
    const axios = useAxios();

    const getAnimeIdFromName = (name: string) => {
        if (animeLoaded)
        {
            var result = animesFlattened?.find((value) => value.alias.toLowerCase() == name.toLowerCase());
            return result?.animeId;
        }
        else
        {
            console.log("tried to find anime id before animes were loaded!")
        }
    };

    const getAnimeNameFromId = (id: number) => {
        if (animeLoaded)
        {
            var result = animes?.find((value) => value.animeId == id);
            return result?.animeName;
        }
        else
        {
            console.log("tried to find anime before animes were loaded!")
        }
    };

    const loadAnimes = () => {
        return axios.get("/Quiz/animes/all")
        .then((res: AxiosResponse<AnimeResponse>) => {
            let animesData: AnimeData[] = res.data.animeData;
            setAnimes(animesData);
            let flattenedAnimes = animesData.flatMap((anime) => anime.aliases.map((animeAlias) => ({ animeId: anime.animeId, malId: anime.malId, alias: animeAlias.alias, language: animeAlias.language })));
            setAnimesFlattened(flattenedAnimes);
            let animeNames = flattenedAnimes.map((anime) => (anime.alias));
            setAnimeNames(animeNames);
        })
        .catch((e) => { console.log("error during anime list fetching: " + e)})
        .then(() => setAnimeLoaded(true));
    }

    return { getAnimeIdFromName, getAnimeNameFromId, loadAnimes };
};
