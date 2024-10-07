import { ReactElement, useContext, useEffect, useState } from 'react';
import { AspectRatio, Button, Container, Flex, Image, Loader, Paper, Slider, Text, Stack, rem, Fieldset, Group } from '@mantine/core';
import { AnimeContext } from '@/context/anime-context';
import { GameState, QuestionResult } from '@/models/GameConfiguration';
import { SoloGameContext } from '../../context/solo-game-context';
import { useSoloGame } from '../../hooks/use-solo-game';
import { useAnimeBase } from '@/hooks/use-anime-base';
import classes from './SoloLobbyView.module.css';
import { LanguagePicker } from '@/components/LanguagePicker/LanguagePicker';
import { AnimeAutocomplete } from '@/components/AnimeAutocomplete/AnimeAutocomplete';
import { AnimeAutocompleteConfig } from '@/components/AnimeAutocompleteConfig/AnimeAutocompleteConfig';

export const SoloLobbyView: React.FC = (): ReactElement => {

  const { isReady, setIsReady, gameState, gameConfiguration,
    questionTimeoutValue, setQuestionTimeoutValue, numberOfQuestionsValue, setNumberOfQuestionsValue,
    currentQuestion, setCurrentQuestion, currentAnswer, setCurrentAnswer, correctAnswers, setCorrectAnswers, lastAnswerData } = useContext(SoloGameContext);
  
  const { startSoloLobby, startSoloGame, answerQuestion } = useSoloGame();

  const { animeLoaded, animeNames, animes } = useContext(AnimeContext);

  const { getAnimeIdFromName , getAnimeNameFromId } = useAnimeBase();

  const [questionTimer, setQuestionTimer] = useState(questionTimeoutValue);
  const [isTimerStarted, setIsTimerStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [animeDefaultLanguage, setAnimeDefaultLanguage] = useState('en');

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
    if (gameState == GameState.QuestionReceived && !isTimerStarted)
    {
      setIsTimerStarted(true);
      let timer = setInterval(() => {
        setQuestionTimer((time) => {
          if (time === 0 || gameState != (GameState.QuestionReceived || GameState.QuestionAnswered || GameState.AnswerReceived)) {
            clearInterval(timer);
            setIsTimerStarted(false);
            return gameConfiguration.questionTimeout;
          } else return time - 1;
        });
      }, 1000);
      }
    else if (gameState == GameState.QuestionTransition)
    {
      setCurrentAnswer({ choice: undefined, customChoice: "" });
    }
  }, [gameState])

  function QuestionTransitionResultComponent(lastAnswerData: QuestionResult) {
    return (
      <div>
        <Stack>
        <Text size="sm">Switching to next question...</Text>
        <Text size="sm">Correct answer was: {getAnimeNameFromId(lastAnswerData.correctAnswerId)}</Text>
        <Text size="sm">Your answer was: {getAnimeNameFromId(lastAnswerData.detectedAnswerId)}</Text>
        </Stack>
      </div>
    )
  }

  function StateElement() {
    return (
      <div>
        { gameState == GameState.QuestionReceived && <Text size="sm">Time left: {questionTimer}</Text>}
        { gameState == GameState.QuestionAnswered && <Text size="sm">Sending answer...</Text>}
        { gameState == GameState.AnswerReceived && <Text size="sm">Answer received!</Text>}
        { gameState == GameState.QuestionTransition && QuestionTransitionResultComponent(lastAnswerData)}
        { gameState == GameState.Finished && <Text size="sm">Game Complete</Text>}
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
            <Fieldset legend="Basic settings">
              <Text size="sm">Time per question</Text>
              <Slider value={questionTimeoutValue} onChangeEnd={handleTimeRangeChange} label={(value) => `${value} sec`} min={15} max={35} marks={[{ value: 15 }, { value: 25 }, { value: 35 }]} />
              <Text size="sm">Number of questions</Text>
              <Slider value={numberOfQuestionsValue} onChangeEnd={handleQuestionNumberRangeChange} label={(value) => `${value}`} min={5} max={30} marks={[{ value: 5 }, { value: 20 }, { value: 30 }]} />
            </Fieldset>
            <Group justify="flex-end" mt="md">
            <Button onClick={startSoloGame}>Start Game</Button>
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
        <Container fluid className={classes.wrapper}>
          <div>Correct answers: {correctAnswers}</div>
          {StateElement()}
          <AspectRatio ratio={16 / 9} maw={720} mx="auto">
            <ImageLoader url={currentQuestion.question}/>
          </AspectRatio>
          
        { 
          gameState != GameState.Finished &&
          <>
          <Group className={classes.answerComponent}>
              <AnimeAutocomplete
                  className={classes.answerBox} data={animes} limit={25} value={currentAnswer.customChoice} onChange={handleAnswerChange}/>
                  <AnimeAutocompleteConfig/>
          </Group>
          <Button size="md" onClick={handleConfirmAnswer}>
              Send Answer
          </Button>
          </>
        }
        </Container>
      </Paper>
    );
  }

  function loadingScreen() {
    return(
      <div className={classes.wrapper}>
        <Loader />
      </div>
    )
  }

  return (
    <>
    {(gameState != GameState.None && animeLoaded) ? ((isInLobbyScreen()) ? settingsScreen() : playingScreen()) : loadingScreen()}</>
  );
}
