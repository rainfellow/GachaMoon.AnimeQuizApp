import { ReactElement, useContext, useEffect, useState } from 'react';
import { AspectRatio, Button, Container, Flex, Image, Loader, Paper, Slider, Text, Stack, rem, Fieldset, Group, Badge, Card, Checkbox, RangeSlider, Drawer, ScrollArea, ActionIcon, Space } from '@mantine/core';
import { AnimeContext } from '@/context/anime-context';
import { GameConfiguration, GameQuestion, GameQuestionType, GameState, GetDefaultConfiguration, QuestionResult } from '@/models/GameConfiguration';
import { SoloGameContext } from '../../context/solo-game-context';
import { useSoloGame } from '../../hooks/use-solo-game';
import { useAnimeBase } from '@/hooks/use-anime-base';
import classes from './SoloLobbyView.module.css';
import { AnimeAutocomplete } from '@/components/AnimeAutocomplete/AnimeAutocomplete';
import { AnimeAutocompleteConfig } from '@/components/AnimeAutocompleteConfig/AnimeAutocompleteConfig';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { CiCircleCheck, CiCircleRemove, CiSquareCheck, CiTrash, CiFileOn} from 'react-icons/ci';
import { useDisclosure, useInterval } from '@mantine/hooks';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { LocalGameSettingsPresets } from '@/models/GameplaySettings';
import { SavePresetModal } from '@/components/SavePresetModal/SavePresetModal';
import { SettingsPresetsDrawer } from '@/components/SetingsPresetsDrawer/SetingsPresetsDrawer';
import superjson from 'superjson';
import { ImageLoader } from '@/components/ImageLoader/ImageLoader';
import { GameRecapComponent } from '@/components/GameRecap/GameRecap';
import { SongLoader } from '@/components/SongLoader/SongLoader';
import { VolumeConfigButton } from '@/components/VolumeConfigButton/VolumeConfigButton';

export const SoloLobbyView: React.FC = (): ReactElement => {
  const { t } = useTranslation('game');
  const { gameState, gameConfiguration,
    currentQuestion, setCurrentQuestion, currentAnswer, setCurrentAnswer, correctAnswers, setCorrectAnswers, lastAnswerData, 
    setQuestionNumber, setQuestionTimeout, setDiversifyAnime, setAnimeAllowedRating, setAnimeAllowedYears, gameName, gameRecap, setImageQuestions, setSongQuestions,
    setAllowEds, setAllowOps, setAllowIns, setAllowMovie, setAllowMusic, setAllowOva, setAllowSpecial, setAllowTv } = useContext(SoloGameContext);

  
  const [opened, { open, close }] = useDisclosure(false);

  const [modalOpened, modalHandlers] = useDisclosure(false);
  
  const { connectToSoloLobby, startSoloGame, answerQuestion } = useSoloGame();

  const { animeLoaded, animes } = useContext(AnimeContext);

  const { getItem, setItem } = useLocalStorage();

  const { getAnimeIdFromName , getAnimeNameFromId } = useAnimeBase();

  const [questionTimer, setQuestionTimer] = useState(gameConfiguration.questionTimeout);
  const interval = useInterval(() => setQuestionTimer((s: number) => Math.max(s - 1, 0)), 1000);
  const [loading, setLoading] = useState(true);
  
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

  const handleTimeRangeChange = (value: number) => {
    setQuestionTimeoutValue(value);
    setQuestionTimeout(value);
  };

  const handleQuestionNumberRangeChange = (value: number) => {
    setQuestionNumberValue(value);
    setQuestionNumber(value);
    if (imageQuestionsValue > value)
    {
      setImageQuestionsValue(value);
      setImageQuestions(value);
      setSongQuestions(0);
    }
    else
    {
      setSongQuestions(value - imageQuestionsValue);
    }
  };

  const handleImageQuestionsRangeChange = (value: number) => {
    setImageQuestionsValue(value);
    setImageQuestions(value);
    setSongQuestions(questionNumberValue - value);
  };

  const handleSongQuestionsRangeChange = (value: number) => {
    setImageQuestionsValue(questionNumberValue - value);
    setImageQuestions(questionNumberValue - value);
    setSongQuestions(value);
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

  const handleAllowOpsChange = (value: boolean) => {
    setAllowOpsValue(value);
    setAllowOps(value);
  };

  const handleAllowEdsChange = (value: boolean) => {
    setAllowEdsValue(value);
    setAllowEds(value);
  };

  const handleAllowInsChange = (value: boolean) => {
    setAllowInsValue(value);
    setAllowIns(value);
  };

  const handleAllowMovieChange = (value: boolean) => {
    setAllowMovieValue(value);
    setAllowMovie(value);
  };

  const handleAllowOvaChange = (value: boolean) => {
    setAllowOvaValue(value);
    setAllowOva(value);
  };

  const handleAllowTvChange = (value: boolean) => {
    setAllowTvValue(value);
    setAllowTv(value);
  };

  const handleAllowMusicChange = (value: boolean) => {
    setAllowMusicValue(value);
    setAllowMusic(value);
  };

  const handleAllowSpecialChange = (value: boolean) => {
    setAllowSpecialValue(value);
    setAllowSpecial(value);
  };

  const handleAnswerChange = (newAnswer: string) => {
    setCurrentAnswer({ choice: undefined, customChoice: newAnswer });
  };
  const handleConfirmAnswer = (answer: string) => {
    let finalChoice: number | undefined;
    if (answer != undefined)
      {
        let answerAnimeId = getAnimeIdFromName(answer);
        finalChoice = answerAnimeId;
      }
      else
      {
        console.log("undefined custom answer!")
      }
      
      answerQuestion({ customChoice: answer, choice: finalChoice });
    
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
        handleTimeRangeChange(preset.questionTimeout);
        handleAllowedRatingRangeChange([preset.minRating, preset.maxRating]);
        handleAllowedYearsRangeChange([preset.minReleaseYear, preset.maxReleaseYear]);
        handleDiversifyChange(preset.diversifyAnime);
        handleQuestionNumberRangeChange(preset.numberOfQuestions);
        handleAllowOpsChange(preset.songConfiguration.allowOps ?? true);
        handleAllowEdsChange(preset.songConfiguration.allowEds ?? true);
        handleAllowInsChange(preset.songConfiguration.allowIns ?? true);
        handleAllowMovieChange(preset.allowMovie ?? true);
        handleAllowTvChange(preset.allowTv ?? true);
        handleAllowOvaChange(preset.allowOva ?? true);
        handleAllowMusicChange(preset.allowMusic ?? true);
        handleAllowSpecialChange(preset.allowSpecial ?? true);
        close();
      }
      else
      {
        console.log('preset load error!')
      }
    }
  }

  const isInLobbyScreen = () => {
    return (gameState == (GameState.Lobby || GameState.Starting || GameState.Finished))
  }

  useEffect(() => {
    connectToSoloLobby()
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

  const QuestionElement = (question: GameQuestion) => {
    if(question.questionType == "Image")
    {
      return (
        <AspectRatio ratio={16 / 9} maw={1280} mah={720} style={{ flex: `0 0 ${768}`}} mx="auto">
        <ImageLoader url={currentQuestion.question} loading={loading} setLoading={setLoading}/>
        </AspectRatio>
      )
    }
    else if(question.questionType == "Song")
    {
      return (
        <Group justify='center' align='center' className={classes.musicBox}>
        <SongLoader source={"https://files.catbox.moe/" + currentQuestion.question} start={0} duration={gameConfiguration.questionTimeout}/>
        </Group>
      )
    }
    else
    {
      console.log('error type: ' + question.questionType)
    }
  }

  function settingsScreen() {
    return (
      <>
      <Paper>
        <SavePresetModal preset={gameConfiguration} onSave={createNewPreset} opened={modalOpened} close={modalHandlers.close}/>
        <SettingsPresetsDrawer presets={configPresets} onloadPreset={loadPreset} onDeletePreset={deletePreset} opened={opened} onClose={close}/>
        <Flex mih={50} gap="md" justify="center" align="center" direction="column" wrap="wrap">
          <Container fluid>
            <Group align="flex-start" justify='center'>
              <Fieldset legend={t('BasicSettingsLabel')} className={classes.settingsFieldset}>
                <Text size="sm">{t('TimePerQuestionLabel')}</Text>
                <Slider value={questionTimeoutValue} onChangeEnd={handleTimeRangeChange} label={(value) => `${value} sec`} min={15} max={35} marks={[{ value: 15 }, { value: 25 }, { value: 35 }]} />
                <Text size="sm">{t('NumberOfQuestionsLabel')}</Text>
                <Slider value={questionNumberValue} onChangeEnd={handleQuestionNumberRangeChange} label={(value) => `${value}`} min={5} max={30} marks={[{ value: 5 }, { value: 20 }, { value: 30 }]} />
              </Fieldset>
              <Fieldset legend={t('QuizTypesSettingsLabel')} className={classes.settingsFieldset}>
                <Text size="sm">{t('ImageQuestionsLabel')}</Text>
                <Slider value={imageQuestionsValue} onChangeEnd={handleImageQuestionsRangeChange} label={(value) => `${value}`} min={0} max={questionNumberValue} />
                <Text size="sm">{t('SongQuestionsLabel')}</Text>
                <Slider value={questionNumberValue - imageQuestionsValue} onChangeEnd={handleSongQuestionsRangeChange} label={(value) => `${value}`} min={0} max={questionNumberValue}/>
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
                {QuestionElement(currentQuestion)}
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
                    className={classes.answerBox} data={animes} limit={25} value={currentAnswer.customChoice} onChange={handleAnswerChange} onEnterPress={handleConfirmAnswer}/>
                    <AnimeAutocompleteConfig/>
                    {currentQuestion.questionType == "Song" && <VolumeConfigButton/>}
            </Group>
            <Group justify='center'>
              <Button size="md" maw={200} disabled={gameState != GameState.QuestionReceived} loading={gameState == GameState.QuestionAnswered} onClick={() => handleConfirmAnswer(currentAnswer.customChoice ?? "")}>
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
    <div style={{overflowY: 'scroll'}}>
    { gameState == GameState.Finished ? <GameRecapComponent gameName={gameName} gameRecap={gameRecap} correctAnswers={correctAnswers} isMultiplayer={false} findAccountNameById={() => { return "" }}/> : 
      (gameState != GameState.None && animeLoaded) ? ((isInLobbyScreen()) ? settingsScreen() : playingScreen()) : loadingScreen()}
    </div>
  );
}
