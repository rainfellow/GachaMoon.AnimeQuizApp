import { ReactElement, useContext, useEffect, useState } from 'react';
import { AspectRatio, Button, Container, Flex, Image, Loader, Paper, Slider, Text, Stack, rem, Fieldset, Group, Badge, Card, Checkbox, RangeSlider, Drawer, ScrollArea, ActionIcon, Space, Divider, MultiSelect } from '@mantine/core';
import { AnimeContext } from '@/context/anime-context';
import { ConfigurationValidationResult, GameConfiguration, GameQuestion, GameQuestionType, GameState, GetDefaultConfiguration, GetDefaultGameQuestion, QuestionResult, ValidateConfiguration } from '@/models/GameConfiguration';
import { SoloGameContext } from '../../context/solo-game-context';
import { useSoloGame } from '../../hooks/use-solo-game';
import { useAnimeBase } from '@/hooks/use-anime-base';
import classes from './SoloLobbyView.module.css';
import { AnimeAutocomplete } from '@/components/AnimeAutocomplete/AnimeAutocomplete';
import { AnimeAutocompleteConfig } from '@/components/AnimeAutocompleteConfig/AnimeAutocompleteConfig';
import { useTranslation } from 'react-i18next';
import { CiCircleCheck, CiCircleRemove, CiSquareCheck } from 'react-icons/ci';
import { useDisclosure, useInterval } from '@mantine/hooks';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { SavePresetModal } from '@/components/SavePresetModal/SavePresetModal';
import { SettingsPresetsDrawer } from '@/components/SetingsPresetsDrawer/SetingsPresetsDrawer';
import { ImageLoader } from '@/components/ImageLoader/ImageLoader';
import { GameRecapComponent } from '@/components/GameRecap/GameRecap';
import { SongLoader } from '@/components/SongLoader/SongLoader';
import { VolumeConfigButton } from '@/components/VolumeConfigButton/VolumeConfigButton';
import { notifications } from '@mantine/notifications';
import { FooterContext } from '@/context/footer-context';
import { BsFillSendFill } from 'react-icons/bs'
import { GetAllAnimeGenres } from '@/models/Anime';
import { GameConfigurationContext } from '@/context/game-configuration-context';

export const SoloLobbyView: React.FC = (): ReactElement => {
  const { t } = useTranslation('game');
  const { gameConfiguration, setGameConfiguration,
    setQuestionNumber, setQuestionTimeout, setDiversifyAnime, setAnimeAllowedRating, setAnimeAllowedYears, setImageQuestions, setSongQuestions,
    setAllowEds, setAllowOps, setAllowIns, setAllowMovie, setAllowMusic, setAllowOva, setAllowSpecial, setAllowTv, setQuestionBonusTime, setMinUserScore, setMaxUserScore,
    setMinSongDifficulty, setMaxSongDifficulty, setMinEndings, setMinInserts, setMinOpenings, setRandomSongs, setImageQuestionsInList, setImageQuestionsNotInList, setImageQuestionsRandom,
    setSongQuestionsInList, setSongQuestionsNotInList, setSongQuestionsRandom, setSongStartMinPercent, setSongStartMaxPercent, setAllowRelatedAnswers, setForceIncludeGenres, setForceExcludeGenres,
    configPresets, createNewPreset, deletePreset, loadPresets, getPreset } = useContext(GameConfigurationContext);

  const { gameState, currentQuestion, currentAnswer, setCurrentAnswer, correctAnswers, setCorrectAnswers, lastAnswerData, gameName, gameRecap } = useContext(SoloGameContext);

  const { setElement } = useContext(FooterContext);

  const [opened, { open, close }] = useDisclosure(false);

  const [modalOpened, modalHandlers] = useDisclosure(false);
  
  const { connectToSoloLobby, startSoloGame, answerQuestion, endSoloGame } = useSoloGame();

  const { animeLoaded, animes } = useContext(AnimeContext);

  const { getItem, setItem } = useLocalStorage();

  const { getAnimeIdFromName , getAnimeNameFromId } = useAnimeBase();

  const [questionTimer, setQuestionTimer] = useState(gameConfiguration.questionTimeout + gameConfiguration.questionBonusTime);
  const interval = useInterval(() => setQuestionTimer((s: number) => { setIsBonusTime(s <= gameConfiguration.questionBonusTime); return Math.max(s - 1, 0) }), 1000);
  const [loading, setLoading] = useState(true);

  const [isBonusTime, setIsBonusTime] = useState(false);

  //basic settings
  const [questionNumberValue, setQuestionNumberValue] = useState(gameConfiguration.numberOfQuestions);
  const [questionTimeoutValue, setQuestionTimeoutValue] = useState(gameConfiguration.questionTimeout);
  const [questionBonusTimeValue, setQuestionBonusTimeValue] = useState(gameConfiguration.questionBonusTime);

  //quiz type settings
  
  const [imageQuestionsValue, setImageQuestionsValue] = useState(gameConfiguration.imageQuestions);

  //anime type filters
  const [allowOvaValue, setAllowOvaValue] = useState(gameConfiguration.allowOva);
  const [allowMusicValue, setAllowMusicValue] = useState(gameConfiguration.allowMusic);
  const [allowTvValue, setAllowTvValue] = useState(gameConfiguration.allowTv);
  const [allowMovieValue, setAllowMovieValue] = useState(gameConfiguration.allowMovie);
  const [allowSpecialValue, setAllowSpecialValue] = useState(gameConfiguration.allowSpecial);

  const [forceIncludeGenresValue, setForceIncludeGenresValue] = useState(gameConfiguration.forceIncludeGenres);
  const [forceExcludeGenresValue, setForceExcludeGenresValue] = useState(gameConfiguration.forceExcludeGenres);

  //songs configuration
  const [allowOpsValue, setAllowOpsValue] = useState(gameConfiguration.songConfiguration.allowOps);
  const [allowEdsValue, setAllowEdsValue] = useState(gameConfiguration.songConfiguration.allowEds);
  const [allowInsValue, setAllowInsValue] = useState(gameConfiguration.songConfiguration.allowIns);

  const [songDifficultyRangeValues, setSongDifficultyRangeValues] = useState<[number, number]>([gameConfiguration.songConfiguration.minSongDifficulty, gameConfiguration.songConfiguration.maxSongDifficulty]);

  const [songQuestionsInListValue, setSongQuestionsInListValue] = useState(gameConfiguration.songConfiguration.songQuestionsInList);
  const [songQuestionsNotInListValue, setSongQuestionsNotInListValue] = useState(gameConfiguration.songConfiguration.songQuestionsNotInList);
  const [songQuestionsRandomValue, setSongQuestionsRandomValue] = useState(gameConfiguration.songConfiguration.songQuestionsRandom);

  const [minOpeningsValue, setMinOpeningsValue] = useState(gameConfiguration.songConfiguration.minOpenings);
  const [minEndingsValue, setMinEndingsValue] = useState(gameConfiguration.songConfiguration.minEndings);
  const [minInsertsValue, setMinInsertsValue] = useState(gameConfiguration.songConfiguration.minInserts);
  const [randomSongsValue, setRandomSongsValue] = useState(gameConfiguration.songConfiguration.randomSongs);

  const [songStartPercentValues, setSongStartPercentValues]= useState<[number, number]>([gameConfiguration.songConfiguration.songStartMinPercent, gameConfiguration.songConfiguration.songStartMaxPercent]);

  //images configuration
  const [imageQuestionsInListValue, setImageQuestionsInListValue] = useState(gameConfiguration.imageConfiguration.imageQuestionsInList);
  const [imageQuestionsNotInListValue, setImageQuestionsNotInListValue] = useState(gameConfiguration.imageConfiguration.imageQuestionsNotInList);
  const [imageQuestionsRandomValue, setImageQuestionsRandomValue] = useState(gameConfiguration.imageConfiguration.imageQuestionsRandom);

  //anime filters
  const [animeYearsRangeValues, setAnimeYearsRangeValues] = useState<[number, number]>([gameConfiguration.minReleaseYear, gameConfiguration.maxReleaseYear]);
  const [animeRatingsRangeValues, setAnimeRatingsRangeValues] = useState<[number, number]>([gameConfiguration.minRating, gameConfiguration.maxRating]);
  const [animeUserScoresRangeValues, setAnimeUserScoresRangeValues] = useState<[number, number]>([gameConfiguration.minUserScore, gameConfiguration.maxUserScore]);

  //experimental
  const [diversifyAnimeValue, setDiversifyAnimeValue] = useState(gameConfiguration.diversifyAnime);

  const [allowRelatedAnswersValue, setAllowRelatedAnswersValue] = useState(gameConfiguration.allowRelatedAnswers);
  //
  const [endGameButtonClicked, setEndGameButtonClicked] = useState(false);

  const handleEndGameButtonClick = () => {
    if (gameState == GameState.Lobby || gameState == GameState.Finished)
    {
      return;
    }
    endSoloGame()
      .then(() => {
        setEndGameButtonClicked(true);
        notifications.show({
          id: 'game-end-notification',
          position: 'top-center',
          withCloseButton: true,
          autoClose: 3000,
          title: t('PrematureGameEndNotificationTitle'),
          message: t('PrematureGameEndNotificationMessage'),
          color: 'blue',
          loading: false,
        });
      })
    .catch(() => {})
  }

  const handleTimeRangeChange = (value: number) => {
    setQuestionTimeoutValue(value);
    setQuestionTimeout(value);
  };
  const handleBonusTimeRangeChange = (value: number) => {
    setQuestionBonusTimeValue(value);
    setQuestionBonusTime(value);
  };

  const handleQuestionNumberRangeChange = (value: number) => {
    setQuestionNumberValue(value);
    setQuestionNumber(value);
    if (imageQuestionsValue > value)
    {
      handleSongQuestionValueChange(0);
      handleImageQuestionValueChange(value);
    }
    else
    {
      handleSongQuestionValueChange(value - imageQuestionsValue);
    }
  };

  const handleImageQuestionsRangeChange = (value: number) => {
    handleSongQuestionValueChange(questionNumberValue - value);
    handleImageQuestionValueChange(value);
  };

  const handleSongQuestionsRangeChange = (value: number) => {
    handleSongQuestionValueChange(value);
    handleImageQuestionValueChange(questionNumberValue - value);
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

  const handleAllowRelatedAnswersChange = (value: boolean) => {
    setAllowRelatedAnswers(value);
    setAllowRelatedAnswersValue(value);
  };

  const handleForceIncludeGenresChange = (value: string[]) => {
    setForceIncludeGenres(value);
    setForceIncludeGenresValue(value);
  }

  const handleForceExcludeGenresChange = (value: string[]) => {
    setForceExcludeGenres(value);
    setForceExcludeGenresValue(value);
  }

  const handleAllowOpsChange = (value: boolean) => {
    if (value == false)
    {
      handleMinOpeningsValueChange(0);
    }
    setAllowOpsValue(value);
    setAllowOps(value);
  };

  const handleAllowEdsChange = (value: boolean) => {
    if (value == false)
    {
      handleMinEndingsValueChange(0);
    }
    setAllowEdsValue(value);
    setAllowEds(value);
  };

  const handleAllowInsChange = (value: boolean) => {
    if (value == false)
    {
      handleMinInsertsValueChange(0);
    }
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

  const handleAnimeUserScoresRangeChange = (value: [number, number]) => {
    setAnimeUserScoresRangeValues(value);
    setMinUserScore(value[0]);
    setMaxUserScore(value[1]);
  };

  const handleSongDifficultyRangeChange = (value: [number, number]) => {
    setSongDifficultyRangeValues(value);
    setMinSongDifficulty(value[0]);
    setMaxSongDifficulty(value[1]);
  };

  const handleSongStartRangeChange = (value: [number, number]) => {
    setSongStartPercentValues(value);
    setSongStartMinPercent(value[0]);
    setSongStartMaxPercent(value[1]);
  };

  const handleImageQuestionValueChange = (value: number) => {
    const currentValue = gameConfiguration.imageQuestions
    let newImageQuestionsRandomValue = imageQuestionsRandomValue;
    let newImageQuestionsInListValue = imageQuestionsInListValue;
    let newImageQuestionsNotInListValue = imageQuestionsNotInListValue;
    if (value > gameConfiguration.imageQuestions)
    {
      newImageQuestionsRandomValue = imageQuestionsRandomValue + value - currentValue;
    }
    else if (value < currentValue)
    {
      let aggregatedValue = value;
      let takeFromRandom = Math.min(imageQuestionsRandomValue, currentValue - aggregatedValue)
      aggregatedValue += takeFromRandom;
      newImageQuestionsRandomValue = (imageQuestionsRandomValue - takeFromRandom);
      if (aggregatedValue < currentValue)
      {
        let takeFromNotInList = Math.min(imageQuestionsNotInListValue, currentValue - aggregatedValue)
        aggregatedValue += takeFromNotInList;
        newImageQuestionsNotInListValue = (imageQuestionsNotInListValue - takeFromNotInList);
      }
      if (aggregatedValue < currentValue)
      {
        let takeFromInList = Math.min(imageQuestionsInListValue, currentValue - aggregatedValue)
        aggregatedValue += takeFromInList;
        newImageQuestionsInListValue = (imageQuestionsInListValue - takeFromInList);
      }
      if (aggregatedValue < currentValue)
      {
        console.log('error while setting image configuration values. parameter mismatch')
      }
    }
    setImageQuestions(value);
    setImageQuestionsValue(value);
    setImageQuestionsRandom(newImageQuestionsRandomValue);
    setImageQuestionsRandomValue(newImageQuestionsRandomValue);
    setImageQuestionsInList(newImageQuestionsInListValue);
    setImageQuestionsInListValue(newImageQuestionsInListValue);
    setImageQuestionsNotInList(newImageQuestionsNotInListValue);
    setImageQuestionsNotInListValue(newImageQuestionsNotInListValue);
  }

  const handleSongQuestionValueChange = (value: number) => {
    const currentValue = gameConfiguration.songQuestions;
    let newMinOpeningsValue = minOpeningsValue;
    let newMinEndingsValue = minEndingsValue;
    let newMinInsertsValue = minInsertsValue;
    let newRandomSongsValue = randomSongsValue;
    let newSongQuestionsRandomValue = songQuestionsRandomValue;
    let newSongQuestionsInListValue = songQuestionsInListValue;
    let newSongQuestionsNotInListValue = songQuestionsNotInListValue;
    if (value > currentValue)
    {
      newRandomSongsValue = (randomSongsValue + value - currentValue)
      newSongQuestionsRandomValue = (songQuestionsRandomValue + value - currentValue)
    }
    else if (value < currentValue)
    {
      let aggregatedValue = value;
      let takeFromRandom = Math.min(randomSongsValue, currentValue - aggregatedValue)
      aggregatedValue += takeFromRandom;
      newRandomSongsValue = (randomSongsValue - takeFromRandom);

      if (aggregatedValue < currentValue)
      {
        let takeFromInserts = Math.min(minInsertsValue, currentValue - aggregatedValue)
        aggregatedValue += takeFromInserts;
        newMinInsertsValue = (minInsertsValue - takeFromInserts);
      }

      if (aggregatedValue < currentValue)
      {
        let takeFromEndings = Math.min(minEndingsValue, currentValue - aggregatedValue)
        aggregatedValue += takeFromEndings;
        newMinEndingsValue = (minEndingsValue - takeFromEndings);
      }
      if (aggregatedValue < currentValue)
      {
        let takeFromOpenings = Math.min(minOpeningsValue, currentValue - aggregatedValue)
        aggregatedValue += takeFromOpenings;
        newMinOpeningsValue = (minOpeningsValue - takeFromOpenings);
      }
      if (aggregatedValue < value)
      {
        console.log('error while setting song configuration values. parameter mismatch')
      }
      aggregatedValue = value;
      takeFromRandom = Math.min(songQuestionsRandomValue, currentValue - aggregatedValue)
      aggregatedValue += takeFromRandom;
      newSongQuestionsRandomValue = (songQuestionsRandomValue - takeFromRandom);
      if (aggregatedValue < currentValue)
      {
        let takeFromNotInList = Math.min(songQuestionsNotInListValue, currentValue - aggregatedValue)
        aggregatedValue += takeFromNotInList;
        newSongQuestionsNotInListValue = (songQuestionsNotInListValue - takeFromNotInList);
      }
      if (aggregatedValue < currentValue)
      {
        let takeFromInList = Math.min(songQuestionsInListValue, currentValue - aggregatedValue)
        aggregatedValue += takeFromInList;
        newSongQuestionsInListValue = (songQuestionsInListValue - takeFromInList);
      }
      if (aggregatedValue < currentValue)
      {
        console.log('error while setting song configuration values. parameter mismatch')
      }
    }
    setRandomSongs(newRandomSongsValue);
    setRandomSongsValue(newRandomSongsValue);
    setMinInserts(newMinInsertsValue);
    setMinInsertsValue(newMinInsertsValue);
    setMinEndings(newMinEndingsValue);
    setMinEndingsValue(newMinEndingsValue);
    setMinOpenings(newMinOpeningsValue);
    setMinOpeningsValue(newMinOpeningsValue);
    setSongQuestionsRandom(newSongQuestionsRandomValue);
    setSongQuestionsRandomValue(newSongQuestionsRandomValue);
    setSongQuestionsNotInList(newSongQuestionsNotInListValue);
    setSongQuestionsNotInListValue(newSongQuestionsNotInListValue);
    setSongQuestionsInList(newSongQuestionsInListValue);
    setSongQuestionsInListValue(newSongQuestionsInListValue);
    setSongQuestions(value);
  }

  const handleMinOpeningsValueChange = (value: number) => {
    value = Math.min(gameConfiguration.songQuestions, value);
    const currentValue = gameConfiguration.songConfiguration.minOpenings;
    let newMinEndingsValue = minEndingsValue;
    let newMinInsertsValue = minInsertsValue;
    let newRandomSongsValue = randomSongsValue;
    if (currentValue > value)
    {
      newRandomSongsValue = (randomSongsValue + currentValue - value)
    }
    else if (currentValue < value)
    {
      let aggregatedValue = currentValue;
      let takeFromRandom = Math.min(randomSongsValue, value - aggregatedValue)
      aggregatedValue += takeFromRandom;
      newRandomSongsValue = (randomSongsValue - takeFromRandom);
      if (aggregatedValue < value)
      {
        let takeFromInserts = Math.min(minInsertsValue, value - aggregatedValue)
        aggregatedValue += takeFromInserts;
        newMinInsertsValue = (minInsertsValue - takeFromInserts);
      }
      if (aggregatedValue < value)
      {
        let takeFromEndings = Math.min(minEndingsValue, value - aggregatedValue)
        aggregatedValue += takeFromEndings;
        newMinEndingsValue = (minEndingsValue - takeFromEndings);
      }
      if (aggregatedValue < value)
      {
        console.log('error while setting song configuration values. parameter mismatch')
      }
    }
    setMinOpenings(value);
    setMinOpeningsValue(value);
    setRandomSongs(newRandomSongsValue)
    setRandomSongsValue(newRandomSongsValue)
    setMinInserts(newMinInsertsValue);
    setMinInsertsValue(newMinInsertsValue);
    setMinEndings(newMinEndingsValue);
    setMinEndingsValue(newMinEndingsValue);
  };

  const handleMinEndingsValueChange = (value: number) => {
    value = Math.min(gameConfiguration.songQuestions, value);
    const currentValue = gameConfiguration.songConfiguration.minEndings;
    let newMinOpeningsValue = minOpeningsValue;
    let newMinInsertsValue = minInsertsValue;
    let newRandomSongsValue = randomSongsValue;
    if (currentValue > value)
    {
      newRandomSongsValue = (randomSongsValue + currentValue - value)
    }
    else if (currentValue < value)
    {
      let aggregatedValue = currentValue;
      let takeFromRandom = Math.min(randomSongsValue, value - aggregatedValue)
      aggregatedValue += takeFromRandom;
      newRandomSongsValue = (randomSongsValue - takeFromRandom);
      if (aggregatedValue < value)
      {
        let takeFromInserts = Math.min(minInsertsValue, value - aggregatedValue)
        aggregatedValue += takeFromInserts;
        newMinInsertsValue = (minInsertsValue - takeFromInserts);
      }
      if (aggregatedValue < value)
      {
        let takeFromOpenings = Math.min(minOpeningsValue, value - aggregatedValue)
        aggregatedValue += takeFromOpenings;
        newMinOpeningsValue = (minOpeningsValue - takeFromOpenings);
      }
      if (aggregatedValue < value)
      {
        console.log('error while setting song configuration values. parameter mismatch')
      }
    }
    setMinEndings(value);
    setMinEndingsValue(value);
    setMinOpenings(newMinOpeningsValue);
    setMinOpeningsValue(newMinOpeningsValue);
    setRandomSongs(newRandomSongsValue)
    setRandomSongsValue(newRandomSongsValue)
    setMinInserts(newMinInsertsValue);
    setMinInsertsValue(newMinInsertsValue);
  };

  const handleMinInsertsValueChange = (value: number) => {
    value = Math.min(gameConfiguration.songQuestions, value);
    const currentValue = gameConfiguration.songConfiguration.minInserts;
    let newMinOpeningsValue = minOpeningsValue;
    let newMinEndingsValue = minEndingsValue;
    let newRandomSongsValue = randomSongsValue;
    if (currentValue > value)
    {
      newRandomSongsValue = (randomSongsValue + currentValue - value);
    }
    else if (currentValue < value)
    {
      let aggregatedValue = currentValue;
      let takeFromRandom = Math.min(randomSongsValue, value - aggregatedValue)
      aggregatedValue += takeFromRandom;
      newRandomSongsValue = (randomSongsValue - takeFromRandom);
      if (aggregatedValue < value)
      {
        let takeFromEndings = Math.min(minEndingsValue, value - aggregatedValue)
        aggregatedValue += takeFromEndings;
        newMinEndingsValue = (minEndingsValue - takeFromEndings);
      }
      if (aggregatedValue < value)
      {
        let takeFromOpenings = Math.min(minOpeningsValue, value - aggregatedValue)
        aggregatedValue += takeFromOpenings;
        newMinOpeningsValue = (minOpeningsValue - takeFromOpenings);
      }
      if (aggregatedValue < value)
      {
        console.log('error while setting song configuration values. parameter mismatch')
      }
    }
    setMinInserts(value);
    setMinInsertsValue(value);
    setMinEndings(newMinEndingsValue);
    setMinEndingsValue(newMinEndingsValue);
    setMinOpenings(newMinOpeningsValue);
    setMinOpeningsValue(newMinOpeningsValue);
    setRandomSongs(newRandomSongsValue)
    setRandomSongsValue(newRandomSongsValue)
  };

  const handleRandomSongsValueChange = (value: number) => {
    value = Math.min(gameConfiguration.songQuestions, value);
    const currentValue = gameConfiguration.songConfiguration.randomSongs;
    if (currentValue > value)
    {
      if (allowOpsValue)
      {
        setMinOpenings(randomSongsValue + currentValue - value)
        setMinOpeningsValue((randomSongsValue) => randomSongsValue + currentValue - value)
      }
      else if (allowEdsValue)
      {
        setMinEndings(randomSongsValue + currentValue - value)
        setMinEndingsValue((randomSongsValue) => randomSongsValue + currentValue - value)
      }
      else if (allowInsValue)
      {
        setMinInserts(randomSongsValue + currentValue - value)
        setMinInsertsValue((randomSongsValue) => randomSongsValue + currentValue - value)
      }
      else
      {
        console.log('error while setting song configuration values. parameter mismatch')
      }
    }
    else if (currentValue < value)
    {
      let aggregatedValue = currentValue;
      let takeFromInserts = Math.min(minInsertsValue, value - aggregatedValue)
      aggregatedValue += takeFromInserts;
      setMinInserts(minInsertsValue - takeFromInserts);
      setMinInsertsValue((minInsertsValue) => minInsertsValue - takeFromInserts);
      if (aggregatedValue < value)
      {
        let takeFromEndings = Math.min(minEndingsValue, value - aggregatedValue)
        aggregatedValue += takeFromEndings;
        setMinEndings(minEndingsValue - takeFromEndings);
        setMinEndingsValue((minEndingsValue) => minEndingsValue - takeFromEndings);
      }
      if (aggregatedValue < value)
      {
        let takeFromOpenings = Math.min(minOpeningsValue, value - aggregatedValue)
        aggregatedValue += takeFromOpenings;
        setMinOpenings(minOpeningsValue - takeFromOpenings);
        setMinOpeningsValue((minOpeningsValue) => minOpeningsValue - takeFromOpenings);
      }
      if (aggregatedValue < value)
      {
        console.log('error while setting song configuration values. parameter mismatch')
      }
    }
    setRandomSongs(value);
    setRandomSongsValue(value);
  };

  const handleSongQuestionsInListValueChange = (value: number) => {
      value = Math.min(value, gameConfiguration.songQuestions);
      const currentValue = gameConfiguration.songConfiguration.songQuestionsInList;

      let newSongQuestionsRandomValue = songQuestionsRandomValue;
      let newSongQuestionsNotInListValue = songQuestionsNotInListValue;

      if (currentValue > value)
      {
        newSongQuestionsRandomValue = songQuestionsRandomValue + currentValue - value;
      }
      else if (currentValue < value)
      {
        let aggregatedValue = currentValue;
        let takeFromRandom = Math.min(songQuestionsRandomValue, value - aggregatedValue)
        newSongQuestionsRandomValue = songQuestionsRandomValue - takeFromRandom;
        aggregatedValue += takeFromRandom;
        if (aggregatedValue < value)
        {
          let takeFromNotInList = Math.min(songQuestionsNotInListValue, value - aggregatedValue)
          aggregatedValue += takeFromNotInList;
          newSongQuestionsNotInListValue = songQuestionsNotInListValue - takeFromNotInList;
        }
        if (aggregatedValue < value)
        {
          console.log('error while setting song configuration values. parameter mismatch')
        }
      }
      setSongQuestionsRandom(newSongQuestionsRandomValue);
      setSongQuestionsRandomValue(newSongQuestionsRandomValue);
      setSongQuestionsNotInList(newSongQuestionsNotInListValue);
      setSongQuestionsNotInListValue(newSongQuestionsNotInListValue);
      setSongQuestionsInList(value);
      setSongQuestionsInListValue(value);
  }

  const handleSongQuestionsNotInListValueChange = (value: number) => {
    value = Math.min(value, gameConfiguration.songQuestions);
    const currentValue = gameConfiguration.songConfiguration.songQuestionsNotInList;
  
    let newSongQuestionsRandomValue = songQuestionsRandomValue;
    let newSongQuestionsInListValue = songQuestionsInListValue;

    if (currentValue > value)
    {
      newSongQuestionsRandomValue = songQuestionsRandomValue + currentValue - value;
    }
    else if (currentValue < value)
    {
      let aggregatedValue = currentValue;
      let takeFromRandom = Math.min(songQuestionsRandomValue, value - aggregatedValue)
      aggregatedValue += takeFromRandom;
      newSongQuestionsRandomValue = songQuestionsRandomValue - takeFromRandom;
      if (aggregatedValue < value)
      {
        let takeFromInList = Math.min(songQuestionsInListValue, value - aggregatedValue)
        aggregatedValue += takeFromInList;
        newSongQuestionsInListValue = (songQuestionsInListValue - takeFromInList);
      }
      if (aggregatedValue < value)
      {
        console.log('error while setting song configuration values. parameter mismatch')
      }
    }
    setSongQuestionsRandom(newSongQuestionsRandomValue);
    setSongQuestionsRandomValue(newSongQuestionsRandomValue);
    setSongQuestionsNotInList(value);
    setSongQuestionsNotInListValue(value);
    setSongQuestionsInList(newSongQuestionsInListValue);
    setSongQuestionsInListValue(newSongQuestionsInListValue);
}

const handleImageQuestionsInListValueChange = (value: number) => {
  value = Math.min(value, gameConfiguration.imageQuestions);
  const currentValue = gameConfiguration.imageConfiguration.imageQuestionsInList;

  let newImageQuestionsRandomValue = imageQuestionsRandomValue;
  let newImageQuestionsNotInListValue = imageQuestionsNotInListValue;

  if (currentValue > value)
  {
    newImageQuestionsRandomValue = (imageQuestionsRandomValue + currentValue - value);
  }
  else if (currentValue < value)
  {
    let aggregatedValue = currentValue;
    let takeFromRandom = Math.min(imageQuestionsRandomValue, value - aggregatedValue)
    aggregatedValue += takeFromRandom;
    newImageQuestionsRandomValue = (imageQuestionsRandomValue - takeFromRandom);
    if (aggregatedValue < value)
    {
      let takeFromNotInList = Math.min(imageQuestionsNotInListValue, value - aggregatedValue)
      aggregatedValue += takeFromNotInList;
      newImageQuestionsNotInListValue = (imageQuestionsNotInListValue - takeFromNotInList);
    }
    if (aggregatedValue < value)
    {
      console.log('error while setting image configuration values. parameter mismatch')
    }
  }
  console.log("in list:" + value + "not in list:" + newImageQuestionsNotInListValue + "random:" + newImageQuestionsRandomValue);
  setImageQuestionsRandom(newImageQuestionsRandomValue);
  setImageQuestionsRandomValue(newImageQuestionsRandomValue);
  setImageQuestionsNotInList(newImageQuestionsNotInListValue);
  setImageQuestionsNotInListValue(newImageQuestionsNotInListValue);
  setImageQuestionsInList(value);
  setImageQuestionsInListValue(value);
}

const handleImageQuestionsNotInListValueChange = (value: number) => {
  value = Math.min(value, gameConfiguration.imageQuestions);
  const currentValue = gameConfiguration.imageConfiguration.imageQuestionsNotInList;

  let newImageQuestionsRandomValue = imageQuestionsRandomValue;
  let newImageQuestionsInListValue = imageQuestionsInListValue;

  if (currentValue > value)
  {
    newImageQuestionsRandomValue = (imageQuestionsRandomValue + currentValue - value);
  }
  else if (currentValue < value)
  {
    let aggregatedValue = currentValue;
    let takeFromRandom = Math.min(imageQuestionsRandomValue, value - aggregatedValue)
    aggregatedValue += takeFromRandom;
    newImageQuestionsRandomValue = (imageQuestionsRandomValue - takeFromRandom);
    if (aggregatedValue < value)
    {
      let takeFromInList = Math.min(imageQuestionsInListValue, value - aggregatedValue)
      aggregatedValue += takeFromInList;
      newImageQuestionsInListValue = (imageQuestionsInListValue - takeFromInList);
    }
    if (aggregatedValue < value)
    {
      console.log('error while setting image configuration values. parameter mismatch')
    }
  }
  console.log("in list:" + newImageQuestionsInListValue + "not in list:" + value + "random:" + newImageQuestionsRandomValue);
  setImageQuestionsRandom(newImageQuestionsRandomValue);
  setImageQuestionsRandomValue(newImageQuestionsRandomValue);
  setImageQuestionsInList(newImageQuestionsInListValue);
  setImageQuestionsInListValue(newImageQuestionsInListValue);
  setImageQuestionsNotInList(value);
  setImageQuestionsNotInListValue(value);
}

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

  const loadPreset = (name: string) => {
    if (configPresets != undefined)
    {
      let preset = getPreset(name);
      setGameConfiguration(preset);
      setQuestionTimeoutValue(preset.questionTimeout);
      setQuestionBonusTimeValue(preset.questionBonusTime);
      setAnimeRatingsRangeValues([preset.minRating, preset.maxRating]);
      setAnimeYearsRangeValues([preset.minReleaseYear, preset.maxReleaseYear]);
      setDiversifyAnimeValue(preset.diversifyAnime);
      setQuestionNumberValue(preset.numberOfQuestions);
      setAllowOpsValue(preset.songConfiguration.allowOps);
      setAllowEdsValue(preset.songConfiguration.allowEds)
      setAllowInsValue(preset.songConfiguration.allowIns);
      setAllowMovieValue(preset.allowMovie);
      setAllowTvValue(preset.allowTv);
      setAllowOvaValue(preset.allowOva);
      setAllowMusicValue(preset.allowMusic);
      setAllowSpecialValue(preset.allowSpecial);
      setSongDifficultyRangeValues([preset.songConfiguration.minSongDifficulty, preset.songConfiguration.maxSongDifficulty]);
      setForceIncludeGenresValue(preset.forceIncludeGenres ?? []);
      setForceExcludeGenresValue(preset.forceExcludeGenres ?? []);
      setAllowRelatedAnswersValue(preset.allowRelatedAnswers ?? false);
      setSongStartPercentValues([preset.songConfiguration.songStartMinPercent ?? 10, preset.songConfiguration.songStartMaxPercent ?? 70]);
      setMinOpeningsValue(preset.songConfiguration.minOpenings);
      setMinEndingsValue(preset.songConfiguration.minEndings);
      setMinInsertsValue(preset.songConfiguration.minInserts);
      setRandomSongsValue(preset.songConfiguration.randomSongs);
      setImageQuestionsValue(preset.imageQuestions);
      setSongQuestionsInListValue(preset.songConfiguration.songQuestionsInList);
      setSongQuestionsNotInListValue(preset.songConfiguration.songQuestionsNotInList);
      setSongQuestionsRandomValue(preset.songConfiguration.songQuestionsRandom);
      setImageQuestionsInListValue(preset.imageConfiguration.imageQuestionsInList);
      setImageQuestionsNotInListValue(preset.imageConfiguration.imageQuestionsNotInList);
      setImageQuestionsRandomValue(preset.imageConfiguration.imageQuestionsRandom);
      setAnimeUserScoresRangeValues([preset.minUserScore ?? 0, preset.maxUserScore ?? 10]);
      close();
    }
    else
    {
      loadPresets();
    }
  }

  const isInLobbyScreen = () => {
    return (gameState == (GameState.Lobby || GameState.Starting || GameState.Finished))
  }

  const handleGameStartButtonClicked = () => {
    let gameConfig = gameConfiguration;
    let validationResult = ValidateConfiguration(gameConfiguration);
    if (validationResult == ConfigurationValidationResult.Valid)
    {
      createNewPreset('autosave', gameConfig); 
      startSoloGame();
    }
    else
    {
      notifications.show({
        id: 'config-error-notification',
        position: 'top-center',
        withCloseButton: true,
        autoClose: 4000,
        title: t('ConfigurationValidationErrorNotificationTitle'),
        message: t('ConfigurationValidationErrorNotificationMessage'),
        color: 'red',
        loading: false,
      });
    }
  }

  useEffect(() => {
    connectToSoloLobby();
    loadPresets();
  }, [])

  useEffect(() => {
    setElement(
      <>
        <Group justify='center'>
          <AnimeAutocompleteConfig/>
          <VolumeConfigButton/>
        </Group>
        {(gameState == GameState.AnswerReceived || gameState == GameState.QuestionTransition || gameState == GameState.QuestionReceived) && 
        <Group justify='center'>
          <Button disabled={endGameButtonClicked} onClick={handleEndGameButtonClick}>
              {t('EndGameButtonLabel')}
          </Button>
        </Group>}
      </>
    );
  }, [endGameButtonClicked, gameState])

  useEffect(() => {
    if (gameState == GameState.Lobby)
    {
      loadPreset('autosave');
    }
    if (gameState == GameState.QuestionReceived)
    {
      setQuestionTimer(gameConfiguration.questionTimeout + gameConfiguration.questionBonusTime);
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
    if (gameState == GameState.Finished)
    {
      setEndGameButtonClicked(false);
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
                      <Stack align='center' justify='flex-start'>
                        <Badge size='xl' color={(questionTimer >= 10 ? 'green' : 'red')} circle>
                          <Text>{questionTimer}</Text>
                        </Badge>
                        {questionTimer < gameConfiguration.questionBonusTime ? <Text>Bonus time</Text> : <></>}
                      </Stack>}
        { gameState == GameState.QuestionAnswered && <Text size="sm">Sending answer...</Text>}
        { gameState == GameState.AnswerReceived && <Text size="sm">Answer received!</Text>}
        { gameState == GameState.QuestionTransition && QuestionTransitionResultComponent(lastAnswerData)}
      </div>
    )
  }

  const QuestionElement = (question: GameQuestion) => {
    if(question.questionType == "Image" || question.questionType == "None")
    {
      return (
        <AspectRatio ratio={16 / 9} maw={1280} mah={720} style={{ flex: `0 0 ${720}`}} mx="auto">
          <ImageLoader url={currentQuestion.question} isBonusTime={isBonusTime} loading={loading} setLoading={setLoading}/>
        </AspectRatio>
      )
    }
    else if(question.questionType == "Song")
    {
      return (
        <Group justify='center' align='center' className={classes.musicBox}>
        <SongLoader source={"https://cdn.gachamoon.xyz/gachamoon-audio/" + currentQuestion.question} start={currentQuestion.songStartTime ?? 0} duration={gameConfiguration.questionTimeout}/>
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
                <Text size="sm">{t('BonusTimePerQuestionLabel')}</Text>
                <Slider value={questionBonusTimeValue} onChangeEnd={handleBonusTimeRangeChange} label={(value) => `${value} sec`} min={0} max={5} />
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
                <RangeSlider value={animeYearsRangeValues} onChangeEnd={handleAllowedYearsRangeChange} min={1970} max={2025} minRange={1}/>
                <Text size="sm">{t('AnimeRatingsRangeLabel')}</Text>
                <RangeSlider value={animeRatingsRangeValues} onChangeEnd={handleAllowedRatingRangeChange} min={0} max={10} minRange={1}/>
                <Text size="sm">{t('AnimeUserScoresRangeLabel')}</Text>
                <RangeSlider value={animeUserScoresRangeValues} onChangeEnd={handleAnimeUserScoresRangeChange} min={0} max={10} minRange={1}/>
              </Fieldset>
              <Fieldset legend={t('ExperimentalSettingsLabel')} className={classes.settingsFieldset}>
              <Checkbox
                label={t('AnimeDiversifyLabel')}
                checked={diversifyAnimeValue}
                onChange={(event) => handleDiversifyChange(event.currentTarget.checked)}
              />
              <Checkbox
                label={t('AnimeAllowRelatedLabel')}
                checked={allowRelatedAnswersValue}
                onChange={(event) => handleAllowRelatedAnswersChange(event.currentTarget.checked)}
              />
              </Fieldset>
              <Fieldset legend={t('AllowedAnimeTypesSettingsLabel')} className={classes.settingsFieldset}>
                <Checkbox label={t('AllowTvLabel')} checked={allowTvValue} onChange={(event) => handleAllowTvChange(event.currentTarget.checked)}/>
                <Checkbox label={t('AllowMovieLabel')} checked={allowMovieValue} onChange={(event) => handleAllowMovieChange(event.currentTarget.checked)}/>
                <Checkbox label={t('AllowOvaLabel')} checked={allowOvaValue} onChange={(event) => handleAllowOvaChange(event.currentTarget.checked)}/>
                <Checkbox label={t('AllowSpecialLabel')} checked={allowSpecialValue} onChange={(event) => handleAllowSpecialChange(event.currentTarget.checked)}/>
                <Checkbox label={t('AllowMusicLabel')} checked={allowMusicValue} onChange={(event) => handleAllowMusicChange(event.currentTarget.checked)}/>
                <Divider/>
                <MultiSelect
                  checkIconPosition="right"
                  data={GetAllAnimeGenres()}
                  label={t('ForceIncludeGenreSelectLabel')}
                  value={forceIncludeGenresValue}
                  onChange={handleForceIncludeGenresChange}
                  placeholder={t('ForceIncludeGenrePlaceholder')}
                  w={250}
                />
                <MultiSelect
                  checkIconPosition="right"
                  data={GetAllAnimeGenres()}
                  label={t('ForceExcludeGenreSelectLabel')}
                  value={forceExcludeGenresValue}
                  onChange={handleForceExcludeGenresChange}
                  placeholder={t('ForceExcludeGenrePlaceholder')}
                  w={250}
                />
              </Fieldset>
              <Fieldset disabled={imageQuestionsValue == questionNumberValue} legend={t('AllowedSongTypesSettingsLabel')} className={classes.settingsFieldset}>
                <Checkbox disabled={imageQuestionsValue == questionNumberValue || (!allowEdsValue && !allowInsValue)} label={t('AllowOpsLabel')} checked={allowOpsValue} onChange={(event) => handleAllowOpsChange(event.currentTarget.checked)}/>
                <Checkbox disabled={imageQuestionsValue == questionNumberValue || (!allowOpsValue && !allowInsValue)} label={t('AllowEdsLabel')} checked={allowEdsValue} onChange={(event) => handleAllowEdsChange(event.currentTarget.checked)}/>
                <Checkbox disabled={imageQuestionsValue == questionNumberValue || (!allowEdsValue && !allowOpsValue)} label={t('AllowInsLabel')} checked={allowInsValue} onChange={(event) => handleAllowInsChange(event.currentTarget.checked)}/>
                <Divider/>
                <Text size="sm">{t('MinOpeningsLabel')}</Text>
                <Slider disabled={imageQuestionsValue == questionNumberValue || !allowOpsValue} value={minOpeningsValue} onChangeEnd={handleMinOpeningsValueChange} min={0} max={questionNumberValue - imageQuestionsValue} label={(value) => `${value}`}/>
                <Text size="sm">{t('MinEndingsLabel')}</Text>
                <Slider disabled={imageQuestionsValue == questionNumberValue || !allowEdsValue} value={minEndingsValue} onChangeEnd={handleMinEndingsValueChange} min={0} max={questionNumberValue - imageQuestionsValue} label={(value) => `${value}`}/>
                <Text size="sm">{t('MinInsertsLabel')}</Text>
                <Slider disabled={imageQuestionsValue == questionNumberValue || !allowInsValue} value={minInsertsValue} onChangeEnd={handleMinInsertsValueChange} min={0} max={questionNumberValue - imageQuestionsValue} label={(value) => `${value}`}/>
                <Text size="sm">{t('RandomSongsLabel')}</Text>
                <Slider disabled={imageQuestionsValue == questionNumberValue} value={randomSongsValue} onChangeEnd={handleRandomSongsValueChange} min={0} max={questionNumberValue - imageQuestionsValue} label={(value) => `${value}`}/>
              </Fieldset>
              <Fieldset disabled={imageQuestionsValue == questionNumberValue} legend={t('SongSettingsLabel')} className={classes.settingsFieldset}>
                <Text size="sm">{t('SongDifficultyRangeLabel')}</Text>
                <RangeSlider disabled={imageQuestionsValue == questionNumberValue} value={songDifficultyRangeValues} onChangeEnd={handleSongDifficultyRangeChange} min={0} max={100} minRange={1}/>
                <Text size="sm">{t('SongStartRangeLabel')}</Text>
                <RangeSlider disabled={imageQuestionsValue == questionNumberValue} value={songStartPercentValues} onChangeEnd={handleSongStartRangeChange} min={0} max={100} minRange={10}/>
                <Divider/>
                <Text size="sm">{t('SongsInListLabel')}</Text>
                <Slider disabled={imageQuestionsValue == questionNumberValue} value={songQuestionsInListValue} onChangeEnd={handleSongQuestionsInListValueChange} min={0} max={questionNumberValue - imageQuestionsValue} label={(value) => `${value}`}/>
                <Text size="sm">{t('SongsNotInListLabel')}</Text>
                <Slider disabled={imageQuestionsValue == questionNumberValue} value={songQuestionsNotInListValue} onChangeEnd={handleSongQuestionsNotInListValueChange} min={0} max={questionNumberValue - imageQuestionsValue} label={(value) => `${value}`}/>
                <Text size="sm">{t('SongsRandomListLabel')}</Text>
                <Slider disabled={true} value={songQuestionsRandomValue} min={0} max={questionNumberValue - imageQuestionsValue} label={(value) => `${value}`}/>
              </Fieldset>
              <Fieldset disabled={imageQuestionsValue == 0} legend={t('ImageSettingsLabel')} className={classes.settingsFieldset}>
                <Text size="sm">{t('ImagesInListLabel')}</Text>
                <Slider disabled={imageQuestionsValue == 0} value={imageQuestionsInListValue} onChangeEnd={handleImageQuestionsInListValueChange} min={0} max={imageQuestionsValue} label={(value) => `${value}`}/>
                <Text size="sm">{t('ImagesNotInListLabel')}</Text>
                <Slider disabled={imageQuestionsValue == 0} value={imageQuestionsNotInListValue} onChangeEnd={handleImageQuestionsNotInListValueChange} min={0} max={imageQuestionsValue} label={(value) => `${value}`}/>
                <Text size="sm">{t('ImagesRandomListLabel')}</Text>
                <Slider disabled={true} value={imageQuestionsRandomValue} min={0} max={imageQuestionsValue} label={(value) => `${value}`}/>
              </Fieldset>
              
            </Group>
            <Group justify='space-between'>
              <Group justify="flex-start" mt="md">
              <Button disabled={gameState == GameState.Starting} onClick={open}>{t('ManagePresetsButton')}</Button>
              <Button disabled={gameState == GameState.Starting} onClick={modalHandlers.open}>{t('SavePresetButton')}</Button>
              </Group>
              <Group justify="flex-end" mt="md">
              <Button loading={gameState == GameState.Starting} loaderProps={{ type: 'dots' }} onClick={() => { handleGameStartButtonClicked() }}>{t('StartGameButton')}</Button>
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
                    className={classes.answerBox} data={animes} limit={20} value={currentAnswer.customChoice} onChange={handleAnswerChange} onEnterPress={handleConfirmAnswer}/>
                    <ActionIcon
                      size={38}
                      disabled={gameState != GameState.QuestionReceived} 
                      loading={gameState == GameState.QuestionAnswered} 
                      onClick={() => handleConfirmAnswer(currentAnswer.customChoice ?? "")}
                      variant="default"
                      aria-label="Configure gameplay settings">
                      <BsFillSendFill style={{ width: rem(22), height: rem(22) }} />
                    </ActionIcon>
            </Group>
          </>
        }
        </Stack>
        <div className={classes.endGameButtonContainer}>
        </div>
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
    <div>
    { gameState == GameState.Finished ? <GameRecapComponent gameName={gameName} gameRecap={gameRecap} correctAnswers={correctAnswers} isMultiplayer={false} findAccountNameById={() => { return "" }}/> : 
      (gameState != GameState.None && animeLoaded) ? ((isInLobbyScreen()) ? settingsScreen() : playingScreen()) : loadingScreen()}
    </div>
  );
}

