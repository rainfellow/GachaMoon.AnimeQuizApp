import { useContext, useRef } from "react";
import { SoloGameContext } from "../context/solo-game-context";
import { useAuth } from "./use-auth";
import SoloHubConnector from '../signalr-solohub'
import { GameAnswer, GameCompletedEvent, GameConfiguration, GameQuestion, GameState, QuestionResult } from "../models/GameConfiguration";
import React from "react";
import { AnimeContext } from "@/context/anime-context";

export interface IAnimeBase {
    getAnimeIdFromName: (name: string) => number | undefined
    getAnimeNameFromId: (id: number) => string | undefined
}

export const useAnimeBase = (): IAnimeBase => {
    const { animeLoaded, loadAnimes, animes, animeNames, animesFlattened } = useContext(AnimeContext);

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

    return { getAnimeIdFromName, getAnimeNameFromId };
};
