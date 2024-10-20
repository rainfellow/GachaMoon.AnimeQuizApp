import { Button, Checkbox, Container, Fieldset, Flex, Group, Paper, RangeSlider, Slider, Stack, Text } from "@mantine/core";
import { ReactElement, useContext, useEffect, useState } from "react";
import { SavePresetModal } from "../SavePresetModal/SavePresetModal";
import { SettingsPresetsDrawer } from "../SetingsPresetsDrawer/SetingsPresetsDrawer";
import { MultiplayerGameContext } from "@/context/multiplayer-game-context";
import { GameConfiguration, GameState, GetDefaultConfiguration } from "@/models/GameConfiguration";
import { useDisclosure } from "@mantine/hooks";
import { LocalGameSettingsPresets } from "@/models/GameplaySettings";
import { useLocalStorage } from "@/hooks/use-local-storage";
import superjson from 'superjson';
import classes from './MultiplayerGameSettings.module.css'
import { useMultiplayerGame } from "@/hooks/use-multiplayer-game";
import { useTranslation } from "react-i18next";

export const MultiplayerGameSettings: React.FC = (): ReactElement => {
     const { gameConfiguration, gameState, setQuestionTimeout, setQuestionNumber, setAnimeAllowedRating, setAnimeAllowedYears, setDiversifyAnime, isLobbyLeader, setImageQuestions, setSongQuestions,
        setAllowEds, setAllowIns, setAllowOps, setAllowMovie, setAllowMusic, setAllowOva, setAllowSpecial, setAllowTv } = useContext(MultiplayerGameContext);

     const { setReadyStatus, updateGameSettings, leaveCurrentGame } = useMultiplayerGame();
     const { t } = useTranslation('game');
     const [isReady, setIsReady] = useState(false);
  
     const [opened, { open, close }] = useDisclosure(false);
     const [modalOpened, modalHandlers] = useDisclosure(false);

     const { getItem, setItem } = useLocalStorage();

     const [configPresets, setConfigPresets] = useState<LocalGameSettingsPresets>({presets: new Map<string, GameConfiguration>()});


     //basic settings
     const [questionNumberValue, setQuestionNumberValue] = useState(gameConfiguration.numberOfQuestions);
     const [questionTimeoutValue, setQuestionTimeoutValue] = useState(gameConfiguration.questionTimeout);

     //quiz type settings
     const [imageQuestionsValue, setImageQuestionsValue] = useState(gameConfiguration.imageQuestions);
     //anime type filters

     const [allowOvaValue, setAllowOvaValue] = useState(gameConfiguration.allowOva);
     const [allowMusicValue, setAllowMusicValue] = useState(gameConfiguration.allowMusic);
     const [allowTvValue, setAllowTvValue] = useState(gameConfiguration.allowTv);
     const [allowMovieValue, setAllowMovieValue] = useState(gameConfiguration.allowMovie);
     const [allowSpecialValue, setAllowSpecialValue] = useState(gameConfiguration.allowSpecial);

     //song type filters

     const [allowOpsValue, setAllowOpsValue] = useState(gameConfiguration.songConfiguration.allowOps);
     const [allowEdsValue, setAllowEdsValue] = useState(gameConfiguration.songConfiguration.allowEds);
     const [allowInsValue, setAllowInsValue] = useState(gameConfiguration.songConfiguration.allowIns);

     //anime filters
     const [animeYearsRangeValues, setAnimeYearsRangeValues] = useState<[number, number]>([gameConfiguration.minReleaseYear, gameConfiguration.maxReleaseYear]);
     const [animeRatingsRangeValues, setAnimeRatingsRangeValues] = useState<[number, number]>([gameConfiguration.minRating, gameConfiguration.maxRating]);
   
     //experimental
     const [diversifyAnimeValue, setDiversifyAnimeValue] = useState(false);

     const handleReadyStatusChange = (value: boolean) => {
        setReadyStatus(value).then(() => {
        setIsReady(value);
        });
      };

     const handleTimeRangeChange = (value: number) => {
        setQuestionTimeoutValue(value);
        setQuestionTimeout(value);
        let a = gameConfiguration;
        a.questionTimeout = value;
        updateGameSettings(a);
      };
    
      const handleQuestionNumberRangeChange = (value: number) => {
        setQuestionNumberValue(value);
        setQuestionNumber(value);
        let a = gameConfiguration;
        if (imageQuestionsValue > value)
        {
          setImageQuestionsValue(value);
          setImageQuestions(value);
          a.imageQuestions = value;
          a.numberOfQuestions = value;
          a.songQuestions = 0;
          setSongQuestions(0);
        }
        else
        {
          setSongQuestions(value - imageQuestionsValue);
          a.songQuestions = value - imageQuestionsValue;
        }
        updateGameSettings(a);
      };
    
      const handleImageQuestionsRangeChange = (value: number) => {
        setImageQuestionsValue(value);
        setImageQuestions(value);
        setSongQuestions(questionNumberValue - value);
        let a = gameConfiguration;
        a.imageQuestions = value;
        a.songQuestions = questionNumberValue - value;
        updateGameSettings(a);
      };
    
      const handleSongQuestionsRangeChange = (value: number) => {
        setImageQuestionsValue(questionNumberValue - value);
        setImageQuestions(questionNumberValue - value);
        setSongQuestions(value);
        let a = gameConfiguration;
        a.songQuestions = value;
        a.imageQuestions = questionNumberValue - value;
        updateGameSettings(a);
      };
    
      const handleAllowedYearsRangeChange = (value: [number, number]) => {
        setAnimeYearsRangeValues(value);
        setAnimeAllowedYears(value[0], value[1]);
        let a = gameConfiguration;
        a.minReleaseYear = value[0];
        a.maxReleaseYear = value[1];
        updateGameSettings(a);
      };
    
      const handleAllowedRatingRangeChange = (value: [number, number]) => {
        setAnimeRatingsRangeValues(value);
        setAnimeAllowedRating(value[0], value[1]);
        let a = gameConfiguration;
        a.minRating = value[0];
        a.maxRating = value[1];
        updateGameSettings(a);
      };
    
      const handleDiversifyChange = (value: boolean) => {
        setDiversifyAnimeValue(value);
        setDiversifyAnime(value);
        let a = gameConfiguration;
        a.diversifyAnime = value;
        updateGameSettings(a);
      };


      const handleAllowOpsChange = (value: boolean) => {
        setAllowOpsValue(value);
        setAllowOps(value);
        let a = gameConfiguration;
        a.songConfiguration.allowOps = value;
        updateGameSettings(a);
      };
    
      const handleAllowEdsChange = (value: boolean) => {
        setAllowEdsValue(value);
        setAllowEds(value);
        let a = gameConfiguration;
        a.songConfiguration.allowEds = value;
        updateGameSettings(a);
      };
    
      const handleAllowInsChange = (value: boolean) => {
        setAllowInsValue(value);
        setAllowIns(value);
        let a = gameConfiguration;
        a.songConfiguration.allowIns = value;
        updateGameSettings(a);
      };
    
      const handleAllowMovieChange = (value: boolean) => {
        setAllowMovieValue(value);
        setAllowMovie(value);
        let a = gameConfiguration;
        a.allowMovie = value;
        updateGameSettings(a);
      };
    
      const handleAllowOvaChange = (value: boolean) => {
        setAllowOvaValue(value);
        setAllowOva(value);
        let a = gameConfiguration;
        a.allowOva = value;
        updateGameSettings(a);
      };
    
      const handleAllowTvChange = (value: boolean) => {
        setAllowTvValue(value);
        setAllowTv(value);
        let a = gameConfiguration;
        a.allowTv = value;
        updateGameSettings(a);
      };
    
      const handleAllowMusicChange = (value: boolean) => {
        setAllowMusicValue(value);
        setAllowMusic(value);
        let a = gameConfiguration;
        a.allowMusic = value;
        updateGameSettings(a);
      };
    
      const handleAllowSpecialChange = (value: boolean) => {
        setAllowSpecialValue(value);
        setAllowSpecial(value);
        let a = gameConfiguration;
        a.allowSpecial = value;
        updateGameSettings(a);
      };

     const createNewPreset = (name: string, gameConfiguration: GameConfiguration) => {
        setConfigPresets((configPresets) => {
          configPresets.presets.set(name, { 
            numberOfQuestions: gameConfiguration.numberOfQuestions, 
            questionTimeout: gameConfiguration.questionTimeout, 
            diversifyAnime: gameConfiguration.diversifyAnime, 
            minRating: gameConfiguration.minRating,
            maxRating: gameConfiguration.maxRating,
            minReleaseYear: gameConfiguration.minReleaseYear,
            maxReleaseYear: gameConfiguration.maxReleaseYear,
            imageQuestions: gameConfiguration.imageQuestions,
            songQuestions: gameConfiguration.songQuestions,
            allowMovie: gameConfiguration.allowMovie,
            allowMusic: gameConfiguration.allowMusic,
            allowOva: gameConfiguration.allowOva,
            allowSpecial: gameConfiguration.allowSpecial,
            allowTv: gameConfiguration.allowTv,
            songConfiguration: gameConfiguration.songConfiguration
          });
          setItem('config-presets', superjson.stringify(configPresets));
          return configPresets;
        })
    }
  
    const deletePreset = (name: string)  => {    
      setConfigPresets((configPresets) => {
          configPresets.presets.delete(name);
          setItem('config-presets', superjson.stringify(configPresets));
          console.log('preset deleted')
          return configPresets;
      })
    }
  
    const loadPreset = (name: string) => {
      if (configPresets != undefined)
      {
        let preset = configPresets.presets.get(name);
        if (preset != undefined)
        {
          setQuestionTimeoutValue(preset.questionTimeout);
          setQuestionTimeout(preset.questionTimeout);
          setAnimeRatingsRangeValues([preset.minRating, preset.maxRating]);
          setAnimeAllowedRating(preset.minRating, preset.maxRating);
          setAnimeYearsRangeValues([preset.minReleaseYear, preset.maxReleaseYear]);
          setAnimeAllowedYears(preset.minReleaseYear, preset.maxReleaseYear);
          setDiversifyAnimeValue(preset.diversifyAnime);
          setDiversifyAnime(preset.diversifyAnime);
          setQuestionNumberValue(preset.numberOfQuestions);
          setQuestionNumber(preset.numberOfQuestions);
          setImageQuestions(preset.imageQuestions);
          setSongQuestions(preset.songQuestions);
          setAllowEds(preset.songConfiguration.allowEds ?? true);
          setAllowEdsValue(preset.songConfiguration.allowEds ?? true);
          setAllowIns(preset.songConfiguration.allowIns ?? true);
          setAllowInsValue(preset.songConfiguration.allowIns ?? true);
          setAllowOps(preset.songConfiguration.allowOps ?? true);
          setAllowOpsValue(preset.songConfiguration.allowOps ?? true);
          setAllowMovie(preset.allowMovie ?? true)
          setAllowMovieValue(preset.allowMovie ?? true);
          setAllowTv(preset.allowTv ?? true);
          setAllowTvValue(preset.allowTv ?? true);
          setAllowMusic(preset.allowMusic ?? true);
          setAllowMusicValue(preset.allowMusic ?? true);
          setAllowOva(preset.allowOva ?? true);
          setAllowOvaValue(preset.allowOva ?? true);
          setAllowSpecial(preset.allowSpecial ?? true);
          setAllowSpecialValue(preset.allowSpecial ?? true);
          updateGameSettings(preset);
          close();
        }
        else
        {
          console.log('preset load error!')
        }
      }
    }

    useEffect(() => {
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
      }, [])

      useEffect(() => {
        if(!isLobbyLeader)
        {
          setQuestionTimeoutValue(gameConfiguration.questionTimeout);
          setQuestionNumberValue(gameConfiguration.numberOfQuestions);
          setAnimeRatingsRangeValues([gameConfiguration.minRating, gameConfiguration.maxRating]);
          setAnimeYearsRangeValues([gameConfiguration.minReleaseYear, gameConfiguration.maxReleaseYear]);
          setDiversifyAnimeValue(gameConfiguration.diversifyAnime);
          setImageQuestionsValue(gameConfiguration.imageQuestions);
        }
      }, [gameConfiguration])

    return (
        <Paper>
        <SavePresetModal preset={gameConfiguration} onSave={createNewPreset} opened={modalOpened} close={modalHandlers.close}/>
        <SettingsPresetsDrawer presets={configPresets} onloadPreset={loadPreset} onDeletePreset={deletePreset} opened={opened} onClose={close}/>
        <Flex mih={50} gap="md" justify="center" align="center" direction="column" wrap="wrap">
          <Container fluid>
            <Group align="flex-start" justify='center'>
              <Fieldset disabled={!isLobbyLeader} legend={t('BasicSettingsLabel')} className={classes.settingsFieldset}>
                <Text size="sm">{t('TimePerQuestionLabel')}</Text>
                <Slider disabled={!isLobbyLeader} value={questionTimeoutValue} onChangeEnd={handleTimeRangeChange} label={(value) => `${value} sec`} min={15} max={35} marks={[{ value: 15 }, { value: 25 }, { value: 35 }]} />
                <Text size="sm">{t('NumberOfQuestionsLabel')}</Text>
                <Slider disabled={!isLobbyLeader} value={questionNumberValue} onChangeEnd={handleQuestionNumberRangeChange} label={(value) => `${value}`} min={5} max={30} marks={[{ value: 5 }, { value: 20 }, { value: 30 }]} />
              </Fieldset>
              <Fieldset legend={t('QuizTypesSettingsLabel')} className={classes.settingsFieldset}>
                <Text size="sm">{t('ImageQuestionsLabel')}</Text>
                <Slider value={imageQuestionsValue} onChangeEnd={handleImageQuestionsRangeChange} label={(value) => `${value}`} min={0} max={questionNumberValue} />
                <Text size="sm">{t('SongQuestionsLabel')}</Text>
                <Slider value={questionNumberValue - imageQuestionsValue} onChangeEnd={handleSongQuestionsRangeChange} label={(value) => `${value}`} min={0} max={questionNumberValue}/>
              </Fieldset>
              <Fieldset disabled={!isLobbyLeader} legend={t('FilteringSettingsLabel')} className={classes.settingsFieldset}>
                <Text size="sm">{t('AnimeYearsRangeLabel')}</Text>
                <RangeSlider disabled={!isLobbyLeader} value={animeYearsRangeValues} onChange={handleAllowedYearsRangeChange} min={1970} max={2025} minRange={1}/>
                <Text size="sm">{t('AnimeRatingsRangeLabel')}</Text>
                <RangeSlider disabled={!isLobbyLeader} value={animeRatingsRangeValues} onChange={handleAllowedRatingRangeChange} min={0} max={10} minRange={1}/>
              </Fieldset>
              <Fieldset legend={t('AllowedAnimeTypesSettingsLabel')} className={classes.settingsFieldset}>
                <Checkbox label={t('AllowTvLabel')} checked={allowTvValue} onChange={(event) => handleAllowTvChange(event.currentTarget.checked)}/>
                <Checkbox label={t('AllowMovieLabel')} checked={allowMovieValue} onChange={(event) => handleAllowMovieChange(event.currentTarget.checked)}/>
                <Checkbox label={t('AllowOvaLabel')} checked={allowOvaValue} onChange={(event) => handleAllowOvaChange(event.currentTarget.checked)}/>
                <Checkbox label={t('AllowSpecialLabel')} checked={allowSpecialValue} onChange={(event) => handleAllowSpecialChange(event.currentTarget.checked)}/>
                <Checkbox label={t('AllowMusicLabel')} checked={allowMusicValue} onChange={(event) => handleAllowMusicChange(event.currentTarget.checked)}/>
              </Fieldset>
              <Fieldset disabled={imageQuestionsValue == questionNumberValue} legend={t('AllowedSongTypesSettingsLabel')} className={classes.settingsFieldset}>
                <Checkbox disabled={imageQuestionsValue == questionNumberValue} label={t('AllowOpsLabel')} checked={allowOpsValue} onChange={(event) => handleAllowOpsChange(event.currentTarget.checked)}/>
                <Checkbox disabled={imageQuestionsValue == questionNumberValue} label={t('AllowEdsLabel')} checked={allowEdsValue} onChange={(event) => handleAllowEdsChange(event.currentTarget.checked)}/>
                <Checkbox disabled={imageQuestionsValue == questionNumberValue} label={t('AllowInsLabel')} checked={allowInsValue} onChange={(event) => handleAllowInsChange(event.currentTarget.checked)}/>
              </Fieldset>
              <Fieldset disabled={!isLobbyLeader} legend={t('ExperimentalSettingsLabel')} className={classes.settingsFieldset}>
              <Checkbox
                disabled={!isLobbyLeader}
                label={t('AnimeDiversifyLabel')}
                checked={diversifyAnimeValue}
                onChange={(event) => handleDiversifyChange(event.currentTarget.checked)}
              />
              </Fieldset>
            </Group>
            <Group justify='space-between'>
              <Group justify="flex-start" mt="md">
              <Button disabled={(gameState == GameState.Starting) || !isLobbyLeader} onClick={open}>{t('ManagePresetsButton')}</Button>
              <Button disabled={(gameState == GameState.Starting) || !isLobbyLeader} onClick={modalHandlers.open}>{t('SavePresetButton')}</Button>
              </Group>
              <Group justify="flex-end" mt="md">
                <Text c={isReady ? 'green' : 'red'}>You are {isReady ? "ready" : "not ready"}</Text>
                <Button loading={gameState == GameState.Starting} loaderProps={{ type: 'dots' }} onClick={() => handleReadyStatusChange(!isReady)}>{ isReady ? t('UnreadyButton') : t('ReadyButton')}</Button>
              </Group>
            </Group>
            <Group justify='flex-start' align='flex-end'>
              <Button disabled={gameState == GameState.Starting} onClick={() => leaveCurrentGame()}>{t('LeaveGameButton')}</Button>
            </Group>
          </Container>
        </Flex>
      </Paper>
      )
}