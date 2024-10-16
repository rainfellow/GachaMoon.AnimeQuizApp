import { Button, Checkbox, Container, Fieldset, Flex, Group, Paper, RangeSlider, Slider, Stack, Text } from "@mantine/core";
import { ReactElement, useContext, useEffect, useState } from "react";
import { SavePresetModal } from "../SavePresetModal/SavePresetModal";
import { SettingsPresetsDrawer } from "../SetingsPresetsDrawer/SetingsPresetsDrawer";
import { MultiplayerGameContext } from "@/context/multiplayer-game-context";
import { GameConfiguration, GameState } from "@/models/GameConfiguration";
import { useDisclosure } from "@mantine/hooks";
import { LocalGameSettingsPresets } from "@/models/GameplaySettings";
import { useLocalStorage } from "@/hooks/use-local-storage";
import superjson from 'superjson';
import classes from './MultiplayerGameSettings.module.css'
import { useMultiplayerGame } from "@/hooks/use-multiplayer-game";
import { useTranslation } from "react-i18next";

export const MultiplayerGameSettings: React.FC = (): ReactElement => {
     const { gameConfiguration, gameState, setQuestionTimeout, setQuestionNumber, setAnimeAllowedRating, setAnimeAllowedYears, setDiversifyAnime, isLobbyLeader } = useContext(MultiplayerGameContext);

     const { setReadyStatus, updateGameSettings } = useMultiplayerGame();
     const { t } = useTranslation('game');
     const [isReady, setIsReady] = useState(false);
  
     const [opened, { open, close }] = useDisclosure(false);
     const [modalOpened, modalHandlers] = useDisclosure(false);

     const { getItem, setItem } = useLocalStorage();

     const [configPresets, setConfigPresets] = useState<LocalGameSettingsPresets>({presets: new Map<string, GameConfiguration>()});


     //basic settings
     const [questionNumberValue, setQuestionNumberValue] = useState(gameConfiguration.numberOfQuestions);
     const [questionTimeoutValue, setQuestionTimeoutValue] = useState(gameConfiguration.questionTimeout);
   
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
        a.numberOfQuestions = value;
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

     const createNewPreset = (name: string, gameConfiguration: GameConfiguration) => {
        setConfigPresets((configPresets) => {
          configPresets.presets.set(name, { 
            numberOfQuestions: gameConfiguration.numberOfQuestions, 
            questionTimeout: gameConfiguration.questionTimeout, 
            diversifyAnime: gameConfiguration.diversifyAnime, 
            minRating: gameConfiguration.minRating,
            maxRating: gameConfiguration.maxRating,
            minReleaseYear: gameConfiguration.minReleaseYear,
            maxReleaseYear: gameConfiguration.maxReleaseYear
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
            configPresets.presets.set('default', { questionTimeout: 20, numberOfQuestions: 10, diversifyAnime: false, minRating: 0, maxRating: 10, minReleaseYear: 1970, maxReleaseYear: 2025})
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
              <Fieldset disabled={!isLobbyLeader} legend={t('FilteringSettingsLabel')} className={classes.settingsFieldset}>
                <Text size="sm">{t('AnimeYearsRangeLabel')}</Text>
                <RangeSlider disabled={!isLobbyLeader} value={animeYearsRangeValues} onChange={handleAllowedYearsRangeChange} min={1970} max={2025} minRange={1}/>
                <Text size="sm">{t('AnimeRatingsRangeLabel')}</Text>
                <RangeSlider disabled={!isLobbyLeader} value={animeRatingsRangeValues} onChange={handleAllowedRatingRangeChange} min={0} max={10} minRange={1}/>
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
                <Button loading={gameState == GameState.Starting} loaderProps={{ type: 'dots' }} onClick={() => handleReadyStatusChange(!isReady)}>{ isReady ? t('ReadyButton') : t('UnReadyButton')}</Button>
              </Group>
            </Group>
          </Container>
        </Flex>
      </Paper>
      )
}