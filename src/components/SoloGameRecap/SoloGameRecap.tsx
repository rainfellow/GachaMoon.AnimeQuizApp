import { SoloGameContext } from '@/context/solo-game-context';
import { useSoloGame } from '@/hooks/use-solo-game';
import { ActionIcon, Group, rem, Image, Text, Stack } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { useContext, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { GameState, PlayerAnswerRecap } from '@/models/GameConfiguration';
import { useAnimeBase } from '@/hooks/use-anime-base';
import classes from './SoloGameRecap.module.css'

export function SoloGameRecap() {
  const { gameRecap, correctAnswers, gameState } = useContext(SoloGameContext);
  const [slideIndex, setSlideIndex] = useState(0);
  const { account } = useAuth()
  const { getAnimeNameFromId } = useAnimeBase();
  const [answersRecap, setAnswersRecap] =useState([{playerAnswer: 0, isCorrect: false, timeToAnswer: 0}]);
  const [correctAnswersList, setCorrectAnswersList] = useState([{answer: 0, question: ""}]);
  const [slides, setSlides] = useState([
    <Carousel.Slide key={0}>
      placeholder
    </Carousel.Slide>]);

  useEffect(() => {
    if(gameRecap.correctAnswers.length > 0)
    {
      console.log("a: " + gameRecap.correctAnswers.length)
      console.log("b: " + gameRecap.playerAnswersRecaps[1])
      console.log("c: " + account?.accountId)
      setAnswersRecap(gameRecap.playerAnswersRecaps[(account?.accountId ?? 0)]);
      setCorrectAnswersList(gameRecap.correctAnswers);
      setSlides(gameRecap.correctAnswers.map((x) => (
        <Carousel.Slide key={x.question}>
          <Image src={x.question} />
        </Carousel.Slide>
      )))
    }
  }, [gameRecap])

  return (
    <Group justify="center" mt="xl">
      <Stack>
        <Text>Game complete! You answered {correctAnswers} questions out of {correctAnswersList.length}</Text>
        <div className={classes.wrapper}>
          <Carousel withIndicators onSlideChange={(value) => setSlideIndex(value)}>{slides}</Carousel>;
        </div>
        <Text>Correct answer: {getAnimeNameFromId(correctAnswersList.at(slideIndex)?.answer ?? 0)}</Text>
        <Text>Your answer: {getAnimeNameFromId(answersRecap.at(slideIndex)?.playerAnswer ?? 0)}</Text>
        <Text>Time to answer: {answersRecap.at(slideIndex)?.timeToAnswer ?? "error"}</Text>
      </Stack>
    </Group>
  );
}
