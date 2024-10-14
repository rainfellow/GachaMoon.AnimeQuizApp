import { SoloGameContext } from '@/context/solo-game-context';
import { Group, rem, Image, Text, Stack, AspectRatio, NumberFormatter, Divider, Grid, Rating, Tooltip, Card, Space, Button, Radio, SegmentedControl, Badge, UnstyledButton } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { useContext, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { PlayerAnswerRecap } from '@/models/GameConfiguration';
import { useAnimeBase } from '@/hooks/use-anime-base';
import classes from './SoloGameRecap.module.css'
import { FaArrowCircleRight, FaArrowCircleLeft } from 'react-icons/fa';
import { CiCircleCheck, CiCircleRemove, CiTimer, CiStar, CiCalendarDate, CiSquareQuestion} from 'react-icons/ci';
import { FiTv, FiCheckCircle, FiHelpCircle } from 'react-icons/fi';
import { FaPerson } from 'react-icons/fa6';
import { MdLocalMovies } from "react-icons/md";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { HoverHelper } from '../HoverHelper/HoverHelper';
import { getAgeRatingTitle } from '@/utils/translation-utils';
import { useAxios } from '@/hooks/use-axios';
import { useDisclosure } from '@mantine/hooks';
import { ReportAnimeBugModal } from '../ReportAnimeBugModal/ReportAnimeBugModal';

export function SoloGameRecap() {
  const { gameRecap, correctAnswers, gameState, gameName } = useContext(SoloGameContext);
  const [slideIndex, setSlideIndex] = useState(0);
  const { account } = useAuth()
  const axios = useAxios();
  const { getAnimeNameFromId, getAnimeFromId } = useAnimeBase();
  const [selectedAnime, setSelectedAnime] = useState({animeId: 0, malId:0, animeName: "", ageRating: "", meanScore: 0, releaseDate: "", episodeCount: 0, animeType: "", aliases: [{animeId: 0, aliasId: 0, language: "", alias: ""}]})
  const [answersRecap, setAnswersRecap] = useState([{playerAnswer: 0, isCorrect: false, timeToAnswer: 0, fromEpisode: 0}]);
  const [correctAnswersList, setCorrectAnswersList] = useState([{answer: 0, question: ""}]);
  const [feedbackOptions, setFeedbackOptions] = useState([{difficultyFeedback: 0, playabilityFeedback: 0}]);

  const [bugModalOpened, { open, close }] = useDisclosure(false);

  
  const [difficultyFeedbackValue, setDifficultyFeedbackValue] = useState("0");
  const [playabilityFeedbackValue, setPlayabilityFeedbackValue] = useState("0");
  const { t } = useTranslation(['common', 'game']);
  const navigate = useNavigate();

  const difficultyFeedbackComponentData = [
    {label: t('game:RateDifficultyObvious'), value: "1"}, 
    {label: t('game:RateDifficultyEasy'), value: "2"}, 
    {label: t('game:RateDifficultyNormal'), value: "3"}, 
    {label: t('game:RateDifficultyHard'), value: "4"}, 
    {label: t('game:RateDifficultyImpossible'), value: "5"}];

  const playabilityFeedbackComponentData = [
    {label: t('game:RatePlayabilityUnplayable'), value: "1"}, 
    {label: t('game:RatePlayabilityNormal'), value: "2"}, 
    {label: t('game:RatePlayabilityGood'), value: "3"}];

  const [slides, setSlides] = useState([
    <Carousel.Slide key={0}>
      placeholder
    </Carousel.Slide>]);

  const AnswerResultComponent = (answerRecap: PlayerAnswerRecap, correctAnswer: number) => {
    return (
      <Stack className={classes.recapCorrectAnswerBox}>
        {
          answerRecap.isCorrect
          ? <Group justify='space-between'>
              <Group justify='flex-start'>
                <CiCircleCheck size={16} color='green'/><Text>{getAnimeNameFromId(answerRecap.playerAnswer)}</Text>
              </Group>
              <Text size="sm" c="dimmed">{t('game:PlayerAnswerLabel')}</Text>
            </Group>
          : 
            <Group justify='space-between'>
              <Group justify='flex-start'>
                <CiCircleRemove size={16} color='red'/><Text>{getAnimeNameFromId(answerRecap.playerAnswer)}</Text>
              </Group>
              <Text size="sm" c="dimmed">{t('game:PlayerAnswerLabel')}</Text>
            </Group>
        }
        {
          !answerRecap.isCorrect && 
          <Group justify='space-between'>
            <Group justify='flex-start'>
              <CiCircleCheck size={16} color='green'/><Text>{getAnimeNameFromId(correctAnswer)}</Text>
            </Group>
            <Text size="sm" c="dimmed">{t('game:CorrectAnswerLabel')}</Text>
          </Group>
        }
      </Stack>
    )
  }

  const handleFinishButtonClick = () => {
    axios
      .post(`/Quiz/feedback/submit`, {gameTitle: gameName, feedbackData: feedbackOptions})
      .then(() => {
        navigate('/');
      })
  }

  const handleDifficultyFeedbackUpdated = (value: string) => {
      setFeedbackOptions((feedbackOptions) => {
        feedbackOptions[slideIndex] = {playabilityFeedback: feedbackOptions[slideIndex].difficultyFeedback, difficultyFeedback: Number(value)};
        return feedbackOptions;
      });
      setDifficultyFeedbackValue(value);
  }

  const handlePlayabilityFeedbackUpdated = (value: string) => {
    setFeedbackOptions((feedbackOptions) => {
      feedbackOptions[slideIndex] = {playabilityFeedback: Number(value), difficultyFeedback: feedbackOptions[slideIndex].difficultyFeedback};
      return feedbackOptions;
    });
    setPlayabilityFeedbackValue(value);
}

  const handleSlideChange = (slideNumber: number) => {
    setSlideIndex(slideNumber);
    setDifficultyFeedbackValue(feedbackOptions[slideNumber].difficultyFeedback.toString());
    setPlayabilityFeedbackValue(feedbackOptions[slideNumber].playabilityFeedback.toString());
    setSelectedAnime(getAnimeFromId(correctAnswersList[slideNumber].answer) ?? 
      {animeId: 0, malId:0, animeName: "", ageRating: "", meanScore: 0, releaseDate: "", episodeCount: 0, animeType: "", aliases: [{animeId: 0, aliasId: 0, language: "", alias: ""}]});
  }

  useEffect(() => {
    if(gameRecap.correctAnswers.length > 0)
    {
      console.log(account?.accountId);
      setAnswersRecap(gameRecap.playerAnswersRecaps[(account?.accountId ?? 0)]);
      setSelectedAnime(getAnimeFromId(gameRecap.correctAnswers[0].answer) ?? 
        {animeId: 0, malId:0, animeName: "", ageRating: "", meanScore: 0, releaseDate: "", episodeCount: 0, animeType: "", aliases: [{animeId: 0, aliasId: 0, language: "", alias: ""}]});
      setCorrectAnswersList(gameRecap.correctAnswers);
      setFeedbackOptions([...Array(gameRecap.correctAnswers.length)].fill({difficultyFeedback: 0, playabilityFeedback: 0}));
      setDifficultyFeedbackValue("0");
      setPlayabilityFeedbackValue("0");
      setSlides(gameRecap.correctAnswers.map((x) => (
        <Carousel.Slide key={x.question}>
            <Image maw={1366} mah={768} fit="contain" src={x.question} />
        </Carousel.Slide>
      )))
    }
  }, [gameRecap])

  return (
  <>
    
    {gameRecap != undefined &&
    <>
    <ReportAnimeBugModal anime={selectedAnime} opened={bugModalOpened} onClose={() => {}} close={close}/>
    <Group justify="center" mt="xl">
      <Stack justify='center'>
        <Group justify='center'>
          
          <Badge color='green' size="xl" >
            <Text>{t('game:RecapLabelUpperBadge')} {correctAnswers} / {correctAnswersList.length}</Text>
          </Badge>
        </Group>
        <div className={classes.carousel}>
          <AspectRatio ratio={16 / 9} maw={1366} mah={768} style={{ flex: `0 0 ${768}` }} mx="auto">
            <Carousel 
              withIndicators
              onSlideChange={(value) => handleSlideChange(value)}
              loop
              nextControlIcon={<FaArrowCircleRight style={{ width: rem(22), height: rem(22) }} />}
              previousControlIcon={<FaArrowCircleLeft style={{ width: rem(22), height: rem(22) }} />}>
                {slides}
            </Carousel>
          </AspectRatio>
        </div>
        <Stack>
          <Divider my="xs" labelPosition="center" /> 
          { AnswerResultComponent(answersRecap.at(slideIndex) ?? {playerAnswer: 0, timeToAnswer: 0, isCorrect: false, fromEpisode: 0}, correctAnswersList.at(slideIndex)?.answer ?? 0) }
          <Divider my="xs" labelPosition="center" /> 
          <Grid justify="center" gutter="xl" align="flex-start">
            <Grid.Col span="content">
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Card.Section withBorder inheritPadding py="xs">
                  <Group justify='center'>
                  <Text size="sm" c="dimmed">{t('game:GameRecapAnswerStatsLabel')}</Text>
                  </Group>
                </Card.Section>
                <Space h="xs"/>
                <Stack align='stretch'>
                  <Tooltip withArrow label={t('game:AnswerTimeTooptip')}>
                    <Group>
                      <CiTimer size={16}/><NumberFormatter value={answersRecap.at(slideIndex)?.timeToAnswer ?? "error"} decimalScale={2} suffix={" " + t('SecondsShort')}/>
                    </Group>
                  </Tooltip>
                  <Tooltip withArrow label={t('game:AnswerFromEpisodeTooltip')}>
                    <Group>
                      <CiSquareQuestion size={16}/><Text>{t('game:AnswerFromEpisodeTitle')} {answersRecap.at(slideIndex)?.fromEpisode ?? "error"}</Text>
                    </Group>
                  </Tooltip>
                  <Tooltip withArrow label={t('game:AnswerGlobalPercentageTooltip')}>
                    <Group>
                      <FiCheckCircle size={16}/>
                      <Text>{t('NotAvailableShort')}</Text>
                    </Group>
                  </Tooltip>
                </Stack>
              </Card>
            </Grid.Col>
            <Grid.Col span="content">
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Card.Section withBorder inheritPadding py="xs">
                  <Group justify='center' align='flex-start'>
                    <Text size="sm" c="dimmed">{t('game:GameRecapAnimeDetailsLabel')}</Text>
                  </Group>
                </Card.Section>
                  <Space h="xs"/>
                <Grid justify="center" align="flex-start" >
                    <Grid.Col span={12} >
                      <Tooltip withArrow label={t('game:AnimeMeanScoreTooltip')}>
                        <Group>
                          <CiStar size={16}/><NumberFormatter value={selectedAnime.meanScore} decimalScale={2}/>
                        </Group>
                      </Tooltip>
                    </Grid.Col>
                    <Grid.Col span="content">
                      <Tooltip withArrow label={t('game:ReleaseDateTooltip')}>
                        <Group>
                          <CiCalendarDate size={16}/><Text>{selectedAnime.releaseDate}</Text>
                        </Group>
                      </Tooltip>
                    </Grid.Col>
                    <Grid.Col span="content" >
                      <Tooltip withArrow label={t('game:AnimeTypeTooltip')}>
                        <Group>
                          <FiTv size={16}/><Text>{selectedAnime.animeType}</Text>
                        </Group>
                      </Tooltip>
                    </Grid.Col>
                    <Grid.Col span="auto" >
                      <Tooltip withArrow label={t('game:TotalEpisodesTooltip')}>
                        <Group>
                          <MdLocalMovies size={16}/><Text>{selectedAnime.episodeCount}</Text>
                        </Group>
                      </Tooltip>
                    </Grid.Col>
                    <Grid.Col span={12} >
                      <Tooltip withArrow label={t('game:AnimeAgeRatingTooltip')}>
                        <Group>
                          <FaPerson size={16}/><Text>{t(getAgeRatingTitle(selectedAnime.ageRating))}</Text>
                        </Group>
                      </Tooltip>
                    </Grid.Col>
                  </Grid>
              </Card>
            </Grid.Col>
            <Grid.Col span="content">
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Card.Section withBorder inheritPadding py="xs">
                    <Group justify='center'>
                      <Text size="sm" c="dimmed">{t('game:GameRecapQuestionFeedbackLabel')}</Text>
                      <HoverHelper displayedText={t('game:GameRecapQuestionFeedbackTooltip')} size='md'/>
                    </Group>
                </Card.Section>
                <Space h="xs"/>
                <Stack align='stretch'>
                  <Tooltip withArrow label={t('game:RateQuestionDifficultyTooltip')}>
                    <Group justify='space-between'>
                      <Text>{t('game:RateQuestionDifficultyLabel')}</Text>
                      <SegmentedControl color="red" value={difficultyFeedbackValue} onChange={handleDifficultyFeedbackUpdated} data={difficultyFeedbackComponentData} />
                    </Group>
                  </Tooltip>
                  <Tooltip withArrow label={t('game:RateQuestionPlayabilityTooltip')}>
                    <Group justify='space-between'>
                      <Text>{t('game:RateQuestionPlayabilityLabel')}</Text>
                      <SegmentedControl color="red" value={playabilityFeedbackValue} onChange={handlePlayabilityFeedbackUpdated} data={playabilityFeedbackComponentData} />
                    </Group>
                  </Tooltip>
                  </Stack>
                </Card>
            </Grid.Col>
          </Grid>
          <Group justify='flex-end'>
            <UnstyledButton size='xs' onClick={() => open()}><Text color='red'>{t('game:ReportAnimeBugLabel')}</Text></UnstyledButton>
          </Group>
          <Divider my="xs" labelPosition="center" /> 
          <Group justify='center'>
            <Button onClick={handleFinishButtonClick}>{t('game:FinishRecapButton')}</Button>
          </Group>
        </Stack>
      </Stack>
    </Group>
    </>
    }
  </>
  );
}
