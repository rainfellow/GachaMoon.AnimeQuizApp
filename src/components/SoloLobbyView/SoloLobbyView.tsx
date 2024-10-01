import { ReactElement, useState, useEffect, useContext } from 'react'

import { SoloGameContext } from '../../context/solo-game-context';
import { useSoloGame } from '../../hooks/use-solo-game';
import { AspectRatio, Button, Container, Slider, Text, Image, Paper, Autocomplete } from '@mantine/core';
import classes from './SoloLobbyView.module.css'
import { AnimeContext } from '@/context/anime-context';
import { GameState } from '@/models/GameConfiguration';

export const SoloLobbyView: React.FC = (): ReactElement => {

  const { isReady, setIsReady, gameState, gameConfiguration,
    questionTimeoutValue, setQuestionTimeoutValue, numberOfQuestionsValue, setNumberOfQuestionsValue,
    currentQuestion, setCurrentQuestion, currentAnswer, setCurrentAnswer, correctAnswers, setCorrectAnswers, lastAnswerData } = useContext(SoloGameContext);
  
  const { startSoloLobby, startSoloGame, answerQuestion } = useSoloGame();

  const { getAnimeIdFromName, animeLoaded, animeNames } = useContext(AnimeContext);

  const [questionTimer, setQuestionTimer] = useState(questionTimeoutValue);
  const [isTimerStarted, setIsTimerStarted] = useState(false);

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

    if (currentAnswer.customChoice != undefined)
    {
      let answerAnimeId = getAnimeIdFromName(currentAnswer.customChoice);
      currentAnswer.choice = answerAnimeId;
    }
    
    answerQuestion(currentAnswer);
  
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
  }, [gameState])

  function StateElement() {
    return (
      <div>
        { gameState == GameState.QuestionReceived && <Text size="sm">Time left: {questionTimer}</Text>}
        { gameState == GameState.QuestionAnswered && <Text size="sm">Sending answer...</Text>}
        { gameState == GameState.AnswerReceived && <Text size="sm">Answer received!</Text>}
        { gameState == GameState.QuestionTransition && <Text size="sm">Switching to next question... Last Answer: {lastAnswerData.correctAnswerId} Your Answer: {lastAnswerData.detectedAnswerId}</Text>}
      </div>
    )
  }


  function settingsScreen() {
    return (
      <>
      <Paper>
        <Container fluid className={classes.settingsWrapper}>
          <Text size="sm">Time per question</Text>
          <Slider value={questionTimeoutValue} onChangeEnd={handleTimeRangeChange} label={(value) => `${value} sec`} min={15} max={35} marks={[{ value: 15 }, { value: 25 }, { value: 35 }]} />
          <Text size="sm">Number of questions</Text>
          <Slider value={numberOfQuestionsValue} onChangeEnd={handleQuestionNumberRangeChange} label={(value) => `${value}`} min={5} max={30} marks={[{ value: 5 }, { value: 20 }, { value: 30 }]} />
          <Button color="primary" size="lg" onClick={startSoloGame}>Start Game</Button>
        </Container>
      </Paper>
      </>
    )
  }

  function playingScreen() {
    console.log(animeNames?.length)
    return (
      <Paper>
      <Container fluid className={classes.wrapper}>
        <div>Correct answers: {correctAnswers}</div>
        {StateElement()}
        <AspectRatio ratio={1920 / 1080} maw={720} mx="auto">
          <Image src={currentQuestion.question} alt="" />
        </AspectRatio>
        <div className={classes.answerBox}>
          <Autocomplete
            placeholder=""
            limit={20}
            data={animeNames}
            value={currentAnswer.customChoice}
            onChange={handleAnswerChange}
        /></div>
        <Button color="primary" size="lg" onClick={handleConfirmAnswer}>Send Answer</Button>
      </Container>
      </Paper>
    )
  }

  return (
    <>
    {(gameState != GameState.None && animeLoaded) ? ((isInLobbyScreen()) ? settingsScreen() : playingScreen()) : <>Creating lobby...</>}</>
  );
}
