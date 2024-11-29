import { useLocalStorage } from "@/hooks/use-local-storage";
import { GameConfiguration, GetDefaultConfiguration, ImageGameConfiguration, SongGameConfiguration } from "@/models/GameConfiguration";
import { LocalGameSettingsPresets } from "@/models/GameplaySettings";
import React, { createContext, useCallback, useState } from "react";
import type { ReactElement } from "react";
import superjson from 'superjson';

export interface IGameConfigurationContext {
    gameConfiguration: GameConfiguration;
    setGameConfiguration: (gameConfiguration: GameConfiguration) => void;
    configPresets: LocalGameSettingsPresets;
    loadPresets: () => void;
    createNewPreset: (name: string, gameConfiguration: GameConfiguration) => void;
    deletePreset: (name: string) => void;
    getPreset: (name: string) => GameConfiguration;

    setQuestionNumber: (value: number) => void;
    setQuestionTimeout: (value: number) => void;
    setDiversifyAnime: (value: boolean) => void;
    setEqualizeQuestions: (value: boolean) => void;
    setAnimeAllowedYears: (minYear: number, maxYear: number) => void;
    setAnimeAllowedRating: (minRating: number, maxRating: number) => void;
    setImageQuestions: (value: number) => void;
    setSongQuestions: (value: number) => void;
    setAllowMovie: (value: boolean) => void;
    setAllowTv: (value: boolean) => void;
    setAllowOva: (value: boolean) => void;
    setAllowMusic: (value: boolean) => void;
    setAllowSpecial: (value: boolean) => void;
    setSongConfiguration: (value: SongGameConfiguration) => void;
    setImageConfiguration: (value: ImageGameConfiguration) => void;
    setAllowOps: (value: boolean) => void;
    setAllowEds: (value: boolean) => void;
    setAllowIns: (value: boolean) => void;
    setMinSongDifficulty: (value: number) => void;
    setMaxSongDifficulty: (value: number) => void;
    setSongQuestionsInList: (value: number) => void;
    setSongQuestionsNotInList: (value: number) => void;
    setSongQuestionsRandom: (value: number) => void;
    setMinOpenings: (value: number) => void;
    setMinEndings: (value: number) => void;
    setMinInserts: (value: number) => void;
    setRandomSongs: (value: number) => void;
    setImageQuestionsInList: (value: number) => void;
    setImageQuestionsNotInList: (value: number) => void;
    setImageQuestionsRandom: (value: number) => void;
    setAllowRelatedAnswers: (value: boolean) => void;
    setSongStartMinPercent: (value: number) => void;
    setSongStartMaxPercent: (value: number) => void;
    setForceIncludeGenres: (value: string[]) => void;
    setForceExcludeGenres: (value: string[]) => void;
    setQuestionBonusTime: (value: number) => void;
    setMinUserScore: (value: number) => void;
    setMaxUserScore: (value: number) => void;
}

export const GameConfigurationContext = createContext<IGameConfigurationContext>({
    gameConfiguration: GetDefaultConfiguration(),
    setGameConfiguration: () => { console.log("") },
    configPresets: {presets: new Map<string, GameConfiguration>()},
    loadPresets: () => { console.log("") },
    createNewPreset: () => { console.log("") },
    deletePreset: () => { console.log("") },
    getPreset: () => { return GetDefaultConfiguration(); },

    setQuestionNumber: () => { console.log("setting game name") },
    setQuestionTimeout: () => { console.log("setting game name") },
    setDiversifyAnime: () => { console.log("setting game name") },
    setEqualizeQuestions: () => { console.log("setting game name") },
    setAnimeAllowedYears: () => { console.log("setting game name") },
    setAnimeAllowedRating: () => { console.log("setting game name") },
    setImageQuestions: () => { console.log("setting game name") },
    setSongQuestions: () => { console.log("setting game name") },
    setAllowTv: () => { console.log("setting game name") },
    setAllowOva: () => { console.log("setting game name") },
    setAllowMovie: () => { console.log("setting game name") },
    setAllowMusic: () => { console.log("setting game name") },
    setAllowSpecial: () => { console.log("setting game name") },
    setSongConfiguration: () => { console.log("setting game name") },
    setImageConfiguration: () => { console.log("setting game name") },
    setAllowOps: () => { console.log("setting game name") },
    setAllowEds: () => { console.log("setting game name") },
    setAllowIns: () => { console.log("setting game name") },
    setMinSongDifficulty: () => { console.log("setting game name") },
    setMaxSongDifficulty: () => { console.log("setting game name") },
    setSongQuestionsInList: () => { console.log("setting game name") },
    setSongQuestionsNotInList: () => { console.log("setting game name") },
    setSongQuestionsRandom: () => { console.log("setting game name") },
    setMinOpenings: () => { console.log("setting game name") },
    setMinEndings: () => { console.log("setting game name") },
    setMinInserts: () => { console.log("setting game name") },
    setRandomSongs: () => { console.log("setting game name") },
    setImageQuestionsInList: () => { console.log("setting game name") },
    setImageQuestionsNotInList: () => { console.log("setting game name") },
    setImageQuestionsRandom: () => { console.log("setting game name") },
    setAllowRelatedAnswers: () => { console.log("setting game name") },
    setSongStartMinPercent: () => { console.log("setting game name") },
    setSongStartMaxPercent: () => { console.log("setting game name") },
    setForceIncludeGenres: () => { console.log("setting game name") },
    setForceExcludeGenres: () => { console.log("setting game name") },
    setQuestionBonusTime: () => { console.log("setting bonus time") },
    setMinUserScore: () => { console.log("setting game name") },
    setMaxUserScore: () => { console.log("setting bonus time") },
});

interface GameConfigurationContextProviderProps {
    children: React.ReactNode;
}

export const GameConfigurationContextProvider: React.FC<GameConfigurationContextProviderProps> = ({
    children
}: GameConfigurationContextProviderProps): ReactElement => {
    
    const { getItem, setItem } = useLocalStorage();

    const [gameConfiguration, setGameConfiguration] = useState<GameConfiguration>(GetDefaultConfiguration());
    const [configPresets, setConfigPresets] = useState<LocalGameSettingsPresets>({presets: new Map<string, GameConfiguration>()});

    const contextValue = {
        gameConfiguration,
        setGameConfiguration: useCallback((gameConfiguration: GameConfiguration) => {
            setGameConfiguration(gameConfiguration);
        }, []),
        configPresets,
        loadPresets: useCallback(() => {
            let configs = getItem('config-presets');
            if (configs != undefined)
            {
                let loadedConfigPresets: LocalGameSettingsPresets = superjson.parse(configs);
                setConfigPresets((configPresets) => {
                    configPresets.presets = loadedConfigPresets.presets;
                    return configPresets;
                });
            }
            else
            {
                setConfigPresets((configPresets) => {
                    configPresets.presets.set('default', GetDefaultConfiguration())
                    return configPresets;
                });
            }
        }, []),
        createNewPreset: useCallback((name: string, gameConfiguration: GameConfiguration) => {
            setConfigPresets((configPresets) => {
                configPresets.presets.set(name, gameConfiguration);
                setItem('config-presets', superjson.stringify(configPresets));
                return configPresets;
              })
        }, []),
        deletePreset: useCallback((name: string) => {
            setConfigPresets((configPresets) => {
                configPresets.presets.delete(name);
                setItem('config-presets', superjson.stringify(configPresets));
                console.log('preset deleted')
                return configPresets;
            })
        }, []),
        getPreset: useCallback((name: string) => {
            let preset = configPresets.presets.get(name);
            if (preset == undefined)
            {
                return GetDefaultConfiguration();
            }
            return preset;
        }, []),

        setQuestionNumber: useCallback((value: number) => {
            setGameConfiguration((gameConfiguration) => {
                gameConfiguration.numberOfQuestions = value;
                return gameConfiguration;
            });
        }, []),
        setQuestionTimeout: useCallback((value: number) => {
            setGameConfiguration((gameConfiguration) => {
                gameConfiguration.questionTimeout = value;
                return gameConfiguration;
            });
        }, []),
        setDiversifyAnime: useCallback((value: boolean) => {
            setGameConfiguration((gameConfiguration) => {
                gameConfiguration.diversifyAnime = value;
                return gameConfiguration;
            });
        }, []),
        setEqualizeQuestions: useCallback((value: boolean) => {
            setGameConfiguration((gameConfiguration) => {
                gameConfiguration.equalizeQuestions = value;
                return gameConfiguration;
            });
        }, []),
        setAnimeAllowedYears: useCallback((minYear: number, maxYear: number) => {
            setGameConfiguration((gameConfiguration) => {
                gameConfiguration.minReleaseYear = minYear;
                gameConfiguration.maxReleaseYear = maxYear;
                return gameConfiguration;
            });
        }, []),
        setAnimeAllowedRating: useCallback((minRating: number, maxRating: number) => {
            setGameConfiguration((gameConfiguration) => {
                gameConfiguration.minRating = minRating;
                gameConfiguration.maxRating = maxRating;
                return gameConfiguration;
            });
        }, []),
        setImageQuestions: useCallback((value: number) => {
            setGameConfiguration((gameConfiguration) => {
                gameConfiguration.imageQuestions = value;
                return gameConfiguration;
            });
        }, []),
        setSongQuestions: useCallback((value: number) => {
            setGameConfiguration((gameConfiguration) => {
                gameConfiguration.songQuestions = value;
                return gameConfiguration;
            });
        }, []),
        setAllowMovie: useCallback((value: boolean) => {
            setGameConfiguration((gameConfiguration) => {
                gameConfiguration.allowMovie = value;
                return gameConfiguration;
            });
        }, []),
        setAllowTv: useCallback((value: boolean) => {
            setGameConfiguration((gameConfiguration) => {
                gameConfiguration.allowTv = value;
                return gameConfiguration;
            });
        }, []),
        setAllowSpecial: useCallback((value: boolean) => {
            setGameConfiguration((gameConfiguration) => {
                gameConfiguration.allowSpecial = value;
                return gameConfiguration;
            });
        }, []),
        setAllowOva: useCallback((value: boolean) => {
            setGameConfiguration((gameConfiguration) => {
                gameConfiguration.allowOva = value;
                return gameConfiguration;
            });
        }, []),
        setAllowMusic: useCallback((value: boolean) => {
            setGameConfiguration((gameConfiguration) => {
                gameConfiguration.allowMusic = value;
                return gameConfiguration;
            });
        }, []),
        setSongConfiguration: useCallback((value: SongGameConfiguration) => {
            setGameConfiguration((gameConfiguration) => {
                gameConfiguration.songConfiguration = value;
                return gameConfiguration;
            });
        }, []),
        setImageConfiguration: useCallback((value: ImageGameConfiguration) => {
            setGameConfiguration((gameConfiguration) => {
                gameConfiguration.imageConfiguration = value;
                return gameConfiguration;
            });
        }, []),
        setAllowOps: useCallback((value: boolean) => {
            setGameConfiguration((gameConfiguration) => {
                gameConfiguration.songConfiguration.allowOps = value;
                return gameConfiguration;
            });
        }, []),
        setAllowEds: useCallback((value: boolean) => {
            setGameConfiguration((gameConfiguration) => {
                gameConfiguration.songConfiguration.allowEds = value;
                return gameConfiguration;
            });
        }, []),
        setAllowIns: useCallback((value: boolean) => {
            setGameConfiguration((gameConfiguration) => {
                gameConfiguration.songConfiguration.allowIns = value;
                return gameConfiguration;
            });
        }, []),
        setMinSongDifficulty: useCallback((value: number) => {
            setGameConfiguration((gameConfiguration) => {
                gameConfiguration.songConfiguration.minSongDifficulty = value;
                return gameConfiguration;
            });
        }, []),
        setMaxSongDifficulty: useCallback((value: number) => {
            setGameConfiguration((gameConfiguration) => {
                gameConfiguration.songConfiguration.maxSongDifficulty = value;
                return gameConfiguration;
            });
        }, []),
        setSongQuestionsInList: useCallback((value: number) => {
            setGameConfiguration((gameConfiguration) => {
                gameConfiguration.songConfiguration.songQuestionsInList = value;
                return gameConfiguration;
            });
        }, []),
        setSongQuestionsNotInList: useCallback((value: number) => {
            setGameConfiguration((gameConfiguration) => {
                gameConfiguration.songConfiguration.songQuestionsNotInList = value;
                return gameConfiguration;
            });
        }, []),
        setSongQuestionsRandom: useCallback((value: number) => {
            setGameConfiguration((gameConfiguration) => {
                gameConfiguration.songConfiguration.songQuestionsRandom = value;
                return gameConfiguration;
            });
        }, []),
        setMinOpenings: useCallback((value: number) => {
            setGameConfiguration((gameConfiguration) => {
                gameConfiguration.songConfiguration.minOpenings = value;
                return gameConfiguration;
            });
        }, []),
        setMinEndings: useCallback((value: number) => {
            setGameConfiguration((gameConfiguration) => {
                gameConfiguration.songConfiguration.minEndings = value;
                return gameConfiguration;
            });
        }, []),
        setMinInserts: useCallback((value: number) => {
            setGameConfiguration((gameConfiguration) => {
                gameConfiguration.songConfiguration.minInserts = value;
                return gameConfiguration;
            });
        }, []),
        setRandomSongs: useCallback((value: number) => {
            setGameConfiguration((gameConfiguration) => {
                gameConfiguration.songConfiguration.randomSongs = value;
                return gameConfiguration;
            });
        }, []),
        setImageQuestionsInList: useCallback((value: number) => {
            setGameConfiguration((gameConfiguration) => {
                gameConfiguration.imageConfiguration.imageQuestionsInList = value;
                return gameConfiguration;
            });
        }, []),
        setImageQuestionsNotInList: useCallback((value: number) => {
            setGameConfiguration((gameConfiguration) => {
                gameConfiguration.imageConfiguration.imageQuestionsNotInList = value;
                return gameConfiguration;
            });
        }, []),
        setImageQuestionsRandom: useCallback((value: number) => {
            setGameConfiguration((gameConfiguration) => {
                gameConfiguration.imageConfiguration.imageQuestionsRandom = value;
                return gameConfiguration;
            });
        }, []),
        setAllowRelatedAnswers: useCallback((value: boolean) => {
            setGameConfiguration((gameConfiguration) => {
                gameConfiguration.allowRelatedAnswers = value;
                return gameConfiguration;
            });
        }, []),
        setSongStartMinPercent: useCallback((value: number) => {
            setGameConfiguration((gameConfiguration) => {
                gameConfiguration.songConfiguration.songStartMinPercent = value;
                return gameConfiguration;
            });
        }, []),
        setSongStartMaxPercent: useCallback((value: number) => {
            setGameConfiguration((gameConfiguration) => {
                gameConfiguration.songConfiguration.songStartMaxPercent = value;
                return gameConfiguration;
            });
        }, []),
        setForceIncludeGenres: useCallback((value: string[]) => {
            setGameConfiguration((gameConfiguration) => {
                gameConfiguration.forceIncludeGenres = value;
                return gameConfiguration;
            });
        }, []),
        setForceExcludeGenres: useCallback((value: string[]) => {
            setGameConfiguration((gameConfiguration) => {
                gameConfiguration.forceExcludeGenres = value;
                return gameConfiguration;
            });
        }, []),
        setQuestionBonusTime: useCallback((value: number) => {
            setGameConfiguration((gameConfiguration) => {
                gameConfiguration.questionBonusTime = value;
                return gameConfiguration;
            });
        }, []),
        setMinUserScore: useCallback((value: number) => {
            setGameConfiguration((gameConfiguration) => {
                gameConfiguration.minUserScore = value;
                return gameConfiguration;
            });
        }, []),
        setMaxUserScore: useCallback((value: number) => {
            setGameConfiguration((gameConfiguration) => {
                gameConfiguration.maxUserScore = value;
                return gameConfiguration;
            });
        }, []),
    };

    return (
        <GameConfigurationContext.Provider value={contextValue}>
            {children}
        </GameConfigurationContext.Provider>
    );
};
