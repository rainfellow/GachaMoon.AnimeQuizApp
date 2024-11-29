import { MultiplayerGameContext } from "@/context/multiplayer-game-context"
import { useMultiplayerGame } from "@/hooks/use-multiplayer-game";
import { StandoffAnimeSelection, StandoffAnimeSelectionResult } from "@/models/GameConfiguration";
import { ReactElement, useContext, useEffect, useState } from "react"
import { AnimeAutocomplete } from "../AnimeAutocomplete/AnimeAutocomplete";
import { AnimeContext } from "@/context/anime-context";
import { AnimeData, GetAllAnimeGenres, UserAnimeData } from "@/models/Anime";
import classes from './MultiplayerGameStandoffSelection.module.css'
import { useAnimeBase } from "@/hooks/use-anime-base";
import { Button, Select, Stack, Text } from "@mantine/core";
import { AnimeOptionSelector } from "../AnimeOptionSelector/AnimeOptionSelector";

export const MultiplayerGameStandoffSelection: React.FC = (): ReactElement => {

    const { selectionData } = useContext(MultiplayerGameContext);
    const { confirmSelection } = useMultiplayerGame();
    const { animes, userAnimeList } = useContext(AnimeContext);
    const { getAnimeIdFromName, getAnimeNameFromId } = useAnimeBase();
    const [selectedCustomAnime, setSelectedCustomAnime] = useState<string>();
    const [selectedAnimeOptions, setSelectedAnimeOptions] = useState<number[]>([]);
    
    const [userAnimes, setUserAnimes] = useState<AnimeData[]>([]);

    const [currentElement, setCurrentElement] = useState<number>(-1);

    const [selectionResult, setSelectionResult] = useState<StandoffAnimeSelectionResult[]>();

    const selectionElements: JSX.Element[] = selectionData.map((value: StandoffAnimeSelection, index: number) => {
        if (!value.hasOptions && value.selectCount == 1 && value.type == "Anime")
        {
            return (
                <AnimeAutocomplete
                    className={classes.answerBox} data={userAnimes} limit={20} value={selectedCustomAnime} onChange={(value: string) => handleSelectedCustomAnimeChange(value, index)} onEnterPress={() => {}}/>
            )
        }
        if (value.hasOptions && value.type == "Anime")
        {
            return (
                <AnimeOptionSelector maxSelect={value.selectCount} options={value.options ?? []} selectedOptions={selectedAnimeOptions} onChange={(selectedOptions: number[]) => handleOptionUpdate(selectedOptions, index)}/>
            )
        }
        if (value.hasOptions && value.type == "Genre" && value.selectCount == 1)
        {
            return (
                <Select
                    placeholder="Pick value"
                    data={value.genreOptions ?? []}
                    onChange={(x) => handleSelectedGenreChange(x ?? "", index)}
                    />
            )
        }
        console.log('some strange selection request returned.')
        return (
            <>
            Error
            </>
        )
    })

    const handleOptionUpdate = (selectedOptions: number[], index: number) => {
        setSelectedAnimeOptions(selectedOptions);
        setSelectionResult((selectionResult) => {
            let element = selectionResult?.at(index);
            if (element != undefined)
            {
                element.selectedAnime = selectedOptions;
            }
            return selectionResult;
        })
    }

    const handleSelectedGenreChange = (newValue: string, index: number) => {
        setSelectionResult((selectionResult) => {
            let element = selectionResult?.at(index);
            if (GetAllAnimeGenres().findIndex((x) => x == newValue) != -1)
            {
                element!.selectedGenres = [newValue];
            }
            else
            {
                console.log('error: some bullshit genre selected.');
            }
            return selectionResult;
        })
    }

    const handleSelectedCustomAnimeChange = (newValue: string, index: number) => {
        setSelectedCustomAnime(newValue);
        let anime = getAnimeIdFromName(newValue);
        if (anime != undefined)
        {
            setSelectionResult((selectionResult) => {
                let element = selectionResult?.at(index);
                element!.selectedAnime = [anime];
                return selectionResult;
            })
        }
      };

    useEffect(() => {
        if (animes != undefined && userAnimeList != undefined)
        {
            setUserAnimes(animes.filter((value: AnimeData) => userAnimeList.userAnimes.findIndex((userAnime: UserAnimeData) => userAnime.id == value.animeId) != -1));
            setSelectionResult(selectionData.map((data: StandoffAnimeSelection) => {
                let res: StandoffAnimeSelectionResult = {
                    cardId: data.cardId,
                    selectedAnime: [],
                    selectedGenres: []
                }
                if (data.type == "Anime")
                {
                    if (data.hasOptions)
                    {
                        res.selectedAnime = data.options!.slice(0, data.selectCount - 1);
                    }
                    else
                    {
                        res.selectedAnime = []
                    }
                }
                else
                {
                    res.selectedGenres = data.genreOptions!.slice(0, data.selectCount - 1);
                }
                return res;
            }))
        }
    }, []);

    useEffect(() => {
        if (currentElement > -1)
        {
            let element = selectionResult?.at(currentElement);
            if (element != null)
            {
                setSelectedCustomAnime(getAnimeNameFromId(element?.selectedAnime[0] ?? userAnimeList?.userAnimes[0].id ?? 0));
                setSelectedAnimeOptions(element?.selectedAnime ?? []);
            }
            else
            {
                console.log('wtf');
            }
        }
        else
        {
            setSelectedCustomAnime("");
            setSelectedAnimeOptions([]);
        }
    }, [currentElement])
    
    return (
        <>
        {currentElement > -1
        ? 
            <Stack>
                {selectionElements.at(currentElement)}
            </Stack>
        : 
            <Stack>
                <Text>Click next to start selection</Text>
            </Stack>
        }
        {currentElement < (selectionResult?.length ?? 0) 
        ?
        <Button onClick={() => setCurrentElement((currentElement) => currentElement + 1)}>
            Next
        </Button>
        :
        <Button onClick={() => { if (selectionResult != undefined) { confirmSelection(selectionResult); }}}>
            Finish
        </Button>
        }
        </>
    )
}
