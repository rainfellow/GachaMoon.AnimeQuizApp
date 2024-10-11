import { ReactElement, useContext, useEffect, useState } from 'react';
import { AspectRatio, Button, Container, Flex, Image, Loader, Paper, Slider, Text, Stack, rem, Fieldset, Group, Badge, Card } from '@mantine/core';
import { AnimeContext } from '@/context/anime-context';
import { GameState, QuestionResult } from '@/models/GameConfiguration';
import { SoloGameContext } from '../../context/solo-game-context';
import { useSoloGame } from '../../hooks/use-solo-game';
import { useAnimeBase } from '@/hooks/use-anime-base';
import classes from './SoloLobbyView.module.css';
import { AnimeAutocomplete } from '@/components/AnimeAutocomplete/AnimeAutocomplete';
import { AnimeAutocompleteConfig } from '@/components/AnimeAutocompleteConfig/AnimeAutocompleteConfig';
import { useTranslation } from 'react-i18next';
import { SoloGameRecap } from '@/components/SoloGameRecap/SoloGameRecap';
import { useNavigate } from 'react-router-dom';
import { CiCircleCheck, CiCircleRemove, CiTimer, CiStar, CiCalendarDate, CiSquareQuestion, CiSquareCheck} from 'react-icons/ci';
import { useInterval } from '@mantine/hooks';

export const SoloLobbyView: React.FC = (): ReactElement => {
  const { t } = useTranslation('game');
  const { isReady, setIsReady, gameState, gameConfiguration,
    questionTimeoutValue, setQuestionTimeoutValue, numberOfQuestionsValue, setNumberOfQuestionsValue,
    currentQuestion, setCurrentQuestion, currentAnswer, setCurrentAnswer, correctAnswers, setCorrectAnswers, lastAnswerData, gameRecap } = useContext(SoloGameContext);
  
  const { startSoloLobby, startSoloGame, answerQuestion } = useSoloGame();
  const navigate = useNavigate()

  const { animeLoaded, animeNames, animes } = useContext(AnimeContext);

  const { getAnimeIdFromName , getAnimeNameFromId } = useAnimeBase();

  const [questionTimer, setQuestionTimer] = useState(questionTimeoutValue);
  const interval = useInterval(() => setQuestionTimer((s) => Math.max(s - 1, 0)), 1000);
  const [loading, setLoading] = useState(true);

  const handleTimeRangeChange = (value: number) => {

    setQuestionTimeoutValue(value);
  
  };

  const handleQuestionNumberRangeChange = (value: number) => {

    setNumberOfQuestionsValue(value);
  
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

  const isInLobbyScreen = () => {
    return (gameState == (GameState.Lobby || GameState.Starting || GameState.Finished))
  }

  useEffect(() => {
    startSoloLobby()
  }, [])

  useEffect(() => {
    if (gameState == GameState.QuestionReceived)
    {
      setQuestionTimer(questionTimeoutValue);
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
        <Flex
          mih={50}
          gap="md"
          justify="center"
          align="center"
          direction="column"
          wrap="wrap"
        >
          <Container fluid className={classes.settingsWrapper}>
            <Group miw="150" justify='center'>
              <Fieldset legend={t('BasicSettingsLabel')}>
                <Text size="sm">{t('TimePerQuestionLabel')}</Text>
                <Slider value={questionTimeoutValue} onChangeEnd={handleTimeRangeChange} label={(value) => `${value} sec`} min={15} max={35} marks={[{ value: 15 }, { value: 25 }, { value: 35 }]} />
                <Text size="sm">{t('NumberOfQuestionsLabel')}</Text>
                <Slider value={numberOfQuestionsValue} onChangeEnd={handleQuestionNumberRangeChange} label={(value) => `${value}`} min={5} max={30} marks={[{ value: 5 }, { value: 20 }, { value: 30 }]} />
              </Fieldset>
            </Group>
            <Group justify="flex-end" mt="md">
            <Button loading={gameState == GameState.Starting} loaderProps={{ type: 'dots' }}onClick={startSoloGame}>{t('StartGameButton')}</Button>
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
              <Button size="md" maw={200} onClick={handleConfirmAnswer}>
                  Send Answer
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
      <div className={classes.imageBox}>
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
