import { ReactElement, useContext, useEffect, useState } from 'react';
import { AspectRatio, Button, Container, Flex, Image, Loader, Paper, Slider, Text, Stack, rem, Fieldset, Group, Badge, Card, Checkbox, RangeSlider, Drawer, ScrollArea, ActionIcon } from '@mantine/core';
import { AnimeContext } from '@/context/anime-context';
import { GameConfiguration, GameState, QuestionResult } from '@/models/GameConfiguration';
import { SoloGameContext } from '../../context/solo-game-context';
import { useSoloGame } from '../../hooks/use-solo-game';
import { useAnimeBase } from '@/hooks/use-anime-base';
import classes from './SoloLobbyView.module.css';
import { AnimeAutocomplete } from '@/components/AnimeAutocomplete/AnimeAutocomplete';
import { AnimeAutocompleteConfig } from '@/components/AnimeAutocompleteConfig/AnimeAutocompleteConfig';
import { useTranslation } from 'react-i18next';
import { SoloGameRecap } from '@/components/SoloGameRecap/SoloGameRecap';
import { useNavigate } from 'react-router-dom';
import { CiCircleCheck, CiCircleRemove, CiSquareCheck, CiTrash, CiFileOn} from 'react-icons/ci';
import { useDisclosure, useInterval } from '@mantine/hooks';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { LocalGameSettingsPresets } from '@/models/GameplaySettings';
import { SavePresetModal } from '@/components/SavePresetModal/SavePresetModal';
import superjson from 'superjson';

export const SoloLobbyView: React.FC = (): ReactElement => {
  const { t } = useTranslation('game');
  const { isReady, setIsReady, gameState, gameConfiguration,
    currentQuestion, setCurrentQuestion, currentAnswer, setCurrentAnswer, correctAnswers, setCorrectAnswers, lastAnswerData, 
    setQuestionNumber, setQuestionTimeout, setDiversifyAnime, setAnimeAllowedRating, setAnimeAllowedYears } = useContext(SoloGameContext);

  
  const [opened, { open, close }] = useDisclosure(false);

  const [modalOpened, modalHandlers] = useDisclosure(false);
  
  const { startSoloLobby, startSoloGame, answerQuestion } = useSoloGame();

  const { animeLoaded, animes } = useContext(AnimeContext);

  const { getItem, setItem } = useLocalStorage();

  const { getAnimeIdFromName , getAnimeNameFromId } = useAnimeBase();

  const [questionTimer, setQuestionTimer] = useState(gameConfiguration.questionTimeout);
  const interval = useInterval(() => setQuestionTimer((s: number) => Math.max(s - 1, 0)), 1000);
  const [loading, setLoading] = useState(true);
  
  const [configPresets, setConfigPresets] = useState<LocalGameSettingsPresets>({presets: new Map<string, GameConfiguration>()});

  const [drawerPresetElements, setDrawerPresetElements] = useState<JSX.Element[]>();

  //basic settings
  const [questionNumberValue, setQuestionNumberValue] = useState(gameConfiguration.numberOfQuestions);
  const [questionTimeoutValue, setQuestionTimeoutValue] = useState(gameConfiguration.questionTimeout);

  //anime filters
  const [animeYearsRangeValues, setAnimeYearsRangeValues] = useState<[number, number]>([gameConfiguration.minReleaseYear, gameConfiguration.maxReleaseYear]);
  const [animeRatingsRangeValues, setAnimeRatingsRangeValues] = useState<[number, number]>([gameConfiguration.minRating, gameConfiguration.maxRating]);

  //experimental
  const [diversifyAnimeValue, setDiversifyAnimeValue] = useState(false);

  const handleTimeRangeChange = (value: number) => {
    setQuestionTimeoutValue(value);
    setQuestionTimeout(value);
  };

  const handleQuestionNumberRangeChange = (value: number) => {
    setQuestionNumberValue(value);
    setQuestionNumber(value);
  };

  const handleAllowedYearsRangeChange = (value: [number, number]) => {
    setAnimeYearsRangeValues(value);
    setAnimeAllowedYears(value[0], value[1]);
  };

  const handleAllowedRatingRangeChange = (value: [number, number]) => {
    setAnimeRatingsRangeValues(value);
    setAnimeAllowedRating(value[0], value[1]);
  };

  const handleDiversifyChange = (value: boolean) => {
    setDiversifyAnimeValue(value);
    setDiversifyAnime(value);
  };

  const handleAnswerChange = (newAnswer: string) => {
    setCurrentAnswer({ choice: undefined, customChoice: newAnswer });
  };
  const handleConfirmAnswer = () => {
    let finalChoice: number | undefined;
    if (currentAnswer.customChoice != undefined)
      {
        let answerAnimeId = getAnimeIdFromName(currentAnswer.customChoice);
        finalChoice = answerAnimeId;
      }
      else
      {
        console.log("undefined custom answer!")
      }
      
      answerQuestion({ customChoice: currentAnswer.customChoice, choice: finalChoice });
    
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
        updateDrawerData(configPresets);
        return configPresets;
      })
  }

  const deletePreset = (name: string)  => {    
    setConfigPresets((configPresets) => {
        configPresets.presets.delete(name);
        setItem('config-presets', superjson.stringify(configPresets));
        updateDrawerData(configPresets);
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
        handleTimeRangeChange(preset.questionTimeout);
        handleAllowedRatingRangeChange([preset.minRating, preset.maxRating]);
        handleAllowedYearsRangeChange([preset.minReleaseYear, preset.maxReleaseYear]);
        handleDiversifyChange(preset.diversifyAnime);
        handleQuestionNumberRangeChange(preset.numberOfQuestions);
        close();
      }
      else
      {
        console.log('preset load error!')
      }
    }
  }

  const updateDrawerData = (configPresets: LocalGameSettingsPresets) => {
    const data = configPresets.presets.keys().map((k) => 
    <Group justify='space-between' key={k}>
      <Group justify='flex-start'>
        <Text>
          {k}
        </Text>
      </Group>
      <Group justify='flex-end'>
        <ActionIcon id={k+"_load_button"} variant="filled" aria-label="Load" onClick={() => loadPreset(k)}>
          <CiFileOn/>
        </ActionIcon>
        <ActionIcon id={k+"_delete_button"} variant="filled" color="red" aria-label="Delete" onClick={() => deletePreset(k)}>
          <CiTrash/>
        </ActionIcon>
      </Group>
    </Group>
      )
    setDrawerPresetElements(data.toArray());
  } 

  const isInLobbyScreen = () => {
    return (gameState == (GameState.Lobby || GameState.Starting || GameState.Finished))
  }

  useEffect(() => {
    startSoloLobby()
    let configs = getItem('config-presets');
    if (configs != undefined)
    {
      let loadedConfigPresets: LocalGameSettingsPresets = superjson.parse(configs);
      setConfigPresets((configPresets) => {
        configPresets.presets = loadedConfigPresets.presets;
        return configPresets;
      });
      updateDrawerData(loadedConfigPresets);
    }
    else
    {
      setConfigPresets((configPresets) => {
        configPresets.presets.set('default', { questionTimeout: 20, numberOfQuestions: 10, diversifyAnime: false, minRating: 0, maxRating: 10, minReleaseYear: 1970, maxReleaseYear: 2025})
        updateDrawerData(configPresets);
        return configPresets;
      });
    }
  }, [])

  useEffect(() => {
    if (gameState == GameState.QuestionReceived)
    {
      setQuestionTimer(gameConfiguration.questionTimeout);
      interval.start();
    }
    else
    {
      interval.stop();
      if (gameState == GameState.QuestionTransition)
        {
          setCurrentAnswer({ choice: undefined, customChoice: "" });
        }
    }
  }, [gameState])

  function QuestionTransitionResultComponent(lastAnswerData: QuestionResult) {
    return (
      <div>
      <Stack justify='center' align='center'>
        <Group justify='center'>
          <Text size="sm" c='dimmed'>{t('SwitchingToNextLabel')}</Text>
        </Group>
        <Group justify='center'>
          {lastAnswerData.isCorrect
          ? <Badge color='green' size="xl" fullWidth leftSection={<CiCircleCheck/>}>{getAnimeNameFromId(lastAnswerData.correctAnswerId)}</Badge>
          : <Badge color='red' size="xl" fullWidth leftSection={<CiCircleRemove/>}>{getAnimeNameFromId(lastAnswerData.correctAnswerId)}</Badge>}
        </Group>
      </Stack>
      </div>
    )
  }

  function StateElement() {
    return (
      <div className={classes.gameStatusText}>
        { gameState == GameState.Started && <Text size="sm">Game started. Waiting for the first question.</Text>}
        { gameState == GameState.QuestionReceived && 
                      <Badge size='xl' color={(questionTimer >= 10 ? 'green' : 'red')} circle>
                        <Text>{questionTimer}</Text>
                      </Badge>}
        { gameState == GameState.QuestionAnswered && <Text size="sm">Sending answer...</Text>}
        { gameState == GameState.AnswerReceived && <Text size="sm">Answer received!</Text>}
        { gameState == GameState.QuestionTransition && QuestionTransitionResultComponent(lastAnswerData)}
      </div>
    )
  }


  function settingsScreen() {
    return (
      <>
      <Paper>
        <SavePresetModal preset={gameConfiguration} onSave={createNewPreset} opened={modalOpened} close={modalHandlers.close}/>
        <Drawer offset={8} radius="md" opened={opened} onClose={close} title={t('game:PresetsDrawerTitle')} scrollAreaComponent={ScrollArea.Autosize}>
          <Stack justify='flex-start'>
            <Text c='dimmed' size='xs'>{t('game:PresetsDrawerDescription')}</Text>
              {configPresets != undefined && drawerPresetElements}
          </Stack>
        </Drawer>
        <Flex
          mih={50}
          gap="md"
          justify="center"
          align="center"
          direction="column"
          wrap="wrap"
        >
          <Container fluid>
            <Group align="flex-start" justify='center'>
              <Fieldset legend={t('BasicSettingsLabel')} className={classes.settingsFieldset}>
                <Text size="sm">{t('TimePerQuestionLabel')}</Text>
                <Slider value={questionTimeoutValue} onChangeEnd={handleTimeRangeChange} label={(value) => `${value} sec`} min={15} max={35} marks={[{ value: 15 }, { value: 25 }, { value: 35 }]} />
                <Text size="sm">{t('NumberOfQuestionsLabel')}</Text>
                <Slider value={questionNumberValue} onChangeEnd={handleQuestionNumberRangeChange} label={(value) => `${value}`} min={5} max={30} marks={[{ value: 5 }, { value: 20 }, { value: 30 }]} />
              </Fieldset>
              <Fieldset legend={t('FilteringSettingsLabel')} className={classes.settingsFieldset}>
                <Text size="sm">{t('AnimeYearsRangeLabel')}</Text>
                <RangeSlider value={animeYearsRangeValues} onChange={handleAllowedYearsRangeChange} min={1970} max={2025} minRange={1}/>
                <Text size="sm">{t('AnimeRatingsRangeLabel')}</Text>
                <RangeSlider value={animeRatingsRangeValues} onChange={handleAllowedRatingRangeChange} min={0} max={10} minRange={1}/>
              </Fieldset>
              <Fieldset legend={t('ExperimentalSettingsLabel')} className={classes.settingsFieldset}>
              <Checkbox
                label={t('AnimeDiversifyLabel')}
                checked={diversifyAnimeValue}
                onChange={(event) => handleDiversifyChange(event.currentTarget.checked)}
              />
              </Fieldset>
            </Group>
            <Group justify='space-between'>
              <Group justify="flex-start" mt="md">
              <Button disabled={gameState == GameState.Starting} onClick={open}>{t('ManagePresetsButton')}</Button>
              <Button disabled={gameState == GameState.Starting} onClick={modalHandlers.open}>{t('SavePresetButton')}</Button>
              </Group>
              <Group justify="flex-end" mt="md">
              <Button loading={gameState == GameState.Starting} loaderProps={{ type: 'dots' }} onClick={startSoloGame}>{t('StartGameButton')}</Button>
              </Group>
            </Group>
          </Container>
        </Flex>
      </Paper>
      </>
    )
  }

  type UrlProps = {
    url: string | null;
  };
  
  const ImageLoader = ({ url }: UrlProps) => {
    return (
      <Flex
        mih="100%"
        gap="md"
        justify="center"
        align="center"
        direction="column"
        wrap="wrap"
      >
          <div style={{ display: loading ? 'block' : 'none' }}>
            <Loader />
          </div>
          <div style={{ display: loading ? 'none' : 'block' }}>
            <Image src={url} onLoad={() => setLoading(false)} />
          </div>
      </Flex>
    )
  };

  function playingScreen() {
    return (
      <Paper>
        <Stack>
          <Group justify='center'>
            {StateElement()}
          </Group>
          <Group justify='center'>
            <div className={classes.boxHidden}>
            </div>
            <div className={classes.imageBox}>
              <AspectRatio ratio={16 / 9} maw={1366} mah={768} style={{ flex: `0 0 ${768}` }} mx="auto">
                <ImageLoader url={currentQuestion.question}/>
              </AspectRatio>
            </div>
            <div className={classes.boxHidden}>
              <Card>
                  <Stack align='center'>
                    <Group justify='flex-start' gap='xs'>
                      <CiSquareCheck/>
                      <Text>{correctAnswers}</Text>
                    </Group>
                  </Stack>
              </Card>
            </div>
          </Group>
        { 
          gameState != GameState.Finished &&
          <>
            <Group className={classes.answerComponent}>
                <AnimeAutocomplete
                    className={classes.answerBox} data={animes} limit={25} value={currentAnswer.customChoice} onChange={handleAnswerChange}/>
                    <AnimeAutocompleteConfig/>
            </Group>
            <Group justify='center'>
              <Button size="md" maw={200} disabled={gameState != GameState.QuestionReceived} loading={gameState == GameState.QuestionAnswered} onClick={handleConfirmAnswer}>
                  {t('SendAnswerButton')}
              </Button>
            </Group>
          </>
        }
        </Stack>
      </Paper>
    );
  }

  function loadingScreen() {
    return(
      <div className={classes.centerAligned}>
        <Loader />
      </div>
    )
  }

  return (
    <>
    { gameState == GameState.Finished ? <SoloGameRecap/> : 
      (gameState != GameState.None && animeLoaded) ? ((isInLobbyScreen()) ? settingsScreen() : playingScreen()) : loadingScreen()}</>
  );
}
