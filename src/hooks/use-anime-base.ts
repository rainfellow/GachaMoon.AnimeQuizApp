import { useContext } from "react";
import { AnimeContext } from "@/context/anime-context";
import { useAxios } from "./use-axios";
import { AxiosResponse } from "axios";
import { AnimeData, AnimeResponse, UserAnimeListData } from "@/models/Anime";
import { LocalSettingsContext } from "@/context/local-settings-context";
import { AnimeAutocompleteOptionDisplay } from "@/models/GameplaySettings";

export interface IAnimeBase {
    getAnimeIdFromName: (name: string) => number | undefined
    getAnimeNameFromId: (id: number) => string | undefined
    getAnimeFromId: (id: number) => AnimeData | undefined
    loadAnimes: () => Promise<void>
    loadUserAnimeList: () => Promise<UserAnimeListData>
}

export const useAnimeBase = (): IAnimeBase => {
    const { animeLoaded, animes, animeNames, animesFlattened, setAnimeLoaded, setAnimeNames, setAnimes, setAnimesFlattened, setUserAnimeList } = useContext(AnimeContext);
    const { animeAutocompleteSettings } = useContext(LocalSettingsContext);
    const axios = useAxios();

    const getAnimeIdFromName = (name: string) => {
        if (animeLoaded)
        {
            var result = animesFlattened?.find((value) => value.alias.toLocaleLowerCase() == name.toLocaleLowerCase());
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
            if (animeAutocompleteSettings.autocompleteBehaviour == AnimeAutocompleteOptionDisplay.Default)
            {
                return result?.animeName;
            }
            else
            {
                return result?.aliases.find((value) => value.language == animeAutocompleteSettings.autocompleteLanguageCode)?.alias ?? result?.animeName;
            }
        }
        else
        {
            console.log("tried to find anime before animes were loaded!")
        }
    };

    const getAnimeFromId = (id: number) => {
        if (animeLoaded)
        {
            var result = animes?.find((value) => value.animeId == id);
            return result;
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
            let flattenedAnimes = animesData.flatMap((anime) => {
                let a = anime.aliases.map((animeAlias) => ({ animeId: anime.animeId, malId: anime.malId, alias: animeAlias.alias, language: animeAlias.language }));
                a.push({ animeId: anime.animeId, alias: anime.animeName, malId: anime.malId, language: 'EN'});
                return a;
            });
            setAnimesFlattened(flattenedAnimes);
            let animeNames = flattenedAnimes.map((anime) => (anime.alias));
            setAnimeNames(animeNames);
        })
        .catch((e) => { console.log("error during anime list fetching: " + e)})
        .then(() => { setAnimeLoaded(true); console.log("loaded animes"); });
    }
    const loadUserAnimeList = () => {
        return axios.get('Account/myanimelist').then((response: AxiosResponse) => {
            let data: UserAnimeListData = response.data;
            setUserAnimeList(data)
            console.log("fetched anime list of user " + response.data.animeListUserId)
            return data;
        })
    }

    return { getAnimeIdFromName, getAnimeNameFromId, loadAnimes, getAnimeFromId, loadUserAnimeList };
};
