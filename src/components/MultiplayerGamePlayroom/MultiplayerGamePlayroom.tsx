import { AspectRatio, Badge, Button, Card, Group, Paper, Stack, Text } from "@mantine/core";
import { ReactElement, useContext, useEffect, useState } from "react";
import { AnimeAutocomplete } from "../AnimeAutocomplete/AnimeAutocomplete";
import { AnimeAutocompleteConfig } from "../AnimeAutocompleteConfig/AnimeAutocompleteConfig";
import { CiCircleCheck, CiCircleRemove, CiSquareCheck } from "react-icons/ci";
import { MultiplayerGameContext } from "@/context/multiplayer-game-context";
import { GameState, PlayerAnswer, QuestionResult } from "@/models/GameConfiguration";
import { ImageLoader } from "../ImageLoader/ImageLoader";
import classes from "./MultiplayerGamePlayroom.module.css"
import { AnimeContext } from "@/context/anime-context";
import { useAnimeBase } from "@/hooks/use-anime-base";
import { useMultiplayerGame } from "@/hooks/use-multiplayer-game";
import { useTranslation } from "react-i18next";
import { useInterval } from "@mantine/hooks";

export const MultiplayerGamePlayroom: React.FC = (): ReactElement => {

    const [loading, setLoading] = useState(false);

    const { animeLoaded, animes } = useContext(AnimeContext);

    const { getAnimeIdFromName , getAnimeNameFromId } = useAnimeBase();

    const [playerResultsElements, setPlayerResultsElements] = useState<JSX.Element[]>();

    const interval = useInterval(() => setQuestionTimer((s: number) => Math.max(s - 1, 0)), 1000);

    const { answerQuestion, accountIdToName } = useMultiplayerGame();

    const { t } = useTranslation('game');

    const { currentQuestion, correctAnswers, gameState, currentAnswer, setCurrentAnswer, lastAnswerData, gameConfiguration, playerAnswers } = useContext(MultiplayerGameContext);

    const [questionTimer, setQuestionTimer] = useState(gameConfiguration.questionTimeout);

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

    const updatePlayerResults = (results: PlayerAnswer[]) => {
      let elements = results.map((x) => 
        <Group justify="space-between">
          <Text c='dimmed'>{accountIdToName(x.accountId)}</Text>
          <Group justify='flex-end'>
            <Text>{x.isCorrect ? '✓ ' : 'X '}</Text>
            <Text>{x.totalCorrect}</Text>
          </Group>
        </Group>
      );
      setPlayerResultsElements(elements);
    }

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

    useEffect(() => {
      updatePlayerResults(playerAnswers);
    }, [playerAnswers])
  
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

    return (
        <Paper>
        <Stack>
          <Group justify='center'>
            {StateElement()}
          </Group>
          <Group justify='center'>
            <div className={classes.box}>
              <Card>
                <Stack>
                  {playerResultsElements}
                </Stack>
              </Card>
            </div>
            <div className={classes.imageBox}>
              <AspectRatio ratio={16 / 9} maw={1366} mah={768} style={{ flex: `0 0 ${768}` }} mx="auto">
                <ImageLoader url={currentQuestion.question} loading={loading} setLoading={setLoading}/>
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
    )
}