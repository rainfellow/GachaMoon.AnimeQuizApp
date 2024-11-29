import { Button, Checkbox, Container, Divider, Fieldset, Flex, Group, MultiSelect, Paper, RangeSlider, Slider, Stack, Text } from "@mantine/core";
import { ReactElement, useContext, useEffect, useState } from "react";
import { SavePresetModal } from "../SavePresetModal/SavePresetModal";
import { SettingsPresetsDrawer } from "../SetingsPresetsDrawer/SetingsPresetsDrawer";
import { MultiplayerGameContext } from "@/context/multiplayer-game-context";
import { GameConfiguration, GameState } from "@/models/GameConfiguration";
import { useDisclosure } from "@mantine/hooks";
import classes from './MultiplayerGameSettings.module.css'
import { useMultiplayerGame } from "@/hooks/use-multiplayer-game";
import { useTranslation } from "react-i18next";
import { GetAllAnimeGenres } from "@/models/Anime";
import { GameConfigurationContext } from "@/context/game-configuration-context";

export const MultiplayerGameSettings: React.FC = (): ReactElement => {
  const { gameConfiguration, setGameConfiguration,
    setQuestionNumber, setQuestionTimeout, setDiversifyAnime, setAnimeAllowedRating, setAnimeAllowedYears, setImageQuestions, setSongQuestions, setEqualizeQuestions,
    setAllowEds, setAllowOps, setAllowIns, setAllowMovie, setAllowMusic, setAllowOva, setAllowSpecial, setAllowTv, setQuestionBonusTime, setMinUserScore, setMaxUserScore,
    setMinSongDifficulty, setMaxSongDifficulty, setMinEndings, setMinInserts, setMinOpenings, setRandomSongs, setImageQuestionsInList, setImageQuestionsNotInList, setImageQuestionsRandom,
    setSongQuestionsInList, setSongQuestionsNotInList, setSongQuestionsRandom, setSongStartMinPercent, setSongStartMaxPercent, setAllowRelatedAnswers, setForceIncludeGenres, setForceExcludeGenres,
    configPresets, createNewPreset, deletePreset, loadPresets, getPreset } = useContext(GameConfigurationContext);
    
  const { gameState, isLobbyLeader } = useContext(MultiplayerGameContext);

  const { setReadyStatus, updateGameSettings, leaveCurrentGame } = useMultiplayerGame();
  const { t } = useTranslation('game');
  const [isReady, setIsReady] = useState(false);

  const [opened, { open, close }] = useDisclosure(false);
  const [modalOpened, modalHandlers] = useDisclosure(false);

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
  const [equalizeQuestionsValue, setEqualizeQuestionsValue] = useState(gameConfiguration.equalizeQuestions);
  const [allowRelatedAnswersValue, setAllowRelatedAnswersValue] = useState(gameConfiguration.allowRelatedAnswers);

  const handleReadyStatusChange = (value: boolean) => {
    setReadyStatus(value).then(() => {
      setIsReady(value);
      if (isLobbyLeader && value)
      {
        createNewPreset('autosave', gameConfiguration);
      }
    });
  };

  const handleBonusTimeRangeChange = (value: number) => {
    setQuestionBonusTimeValue(value);
    setQuestionBonusTime(value);
  };

  const handleEqualizeChange = (value: boolean) => {
    setEqualizeQuestionsValue(value);
    setEqualizeQuestions(value);
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
  const handleTimeRangeChange = (value: number) => {
    setQuestionTimeoutValue(value);
    setQuestionTimeout(value);
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
      //handleImageQuestionValueChange(imageQuestionsValue);
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
    //value = Math.min(gameConfiguration.songQuestions, value);
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
    //value = Math.min(gameConfiguration.songQuestions, value);
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
    //value = Math.min(gameConfiguration.songQuestions, value);
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
    //value = Math.min(gameConfiguration.songQuestions, value);
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
      //value = Math.min(value, gameConfiguration.songQuestions);
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
    //value = Math.min(value, gameConfiguration.songQuestions);
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
  //value = Math.min(value, gameConfiguration.imageQuestions);
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
  //value = Math.min(value, gameConfiguration.imageQuestions);
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

const loadPreset = (name: string) => {
  if (configPresets != undefined)
  {
    let preset = getPreset(name);
    setGameConfiguration(preset);
    setAllConfigurationValues(preset);
    updateGameSettings(preset);
    close();
  }
  else
  {
    loadPresets();
  }
}

const setAllConfigurationValues = (gameConfiguration: GameConfiguration) => {
  setQuestionTimeoutValue(gameConfiguration.questionTimeout);
  setQuestionNumberValue(gameConfiguration.numberOfQuestions);
  setAnimeRatingsRangeValues([gameConfiguration.minRating, gameConfiguration.maxRating]);
  setAnimeYearsRangeValues([gameConfiguration.minReleaseYear, gameConfiguration.maxReleaseYear]);
  setDiversifyAnimeValue(gameConfiguration.diversifyAnime);
  setEqualizeQuestionsValue(gameConfiguration.equalizeQuestions);
  setImageQuestionsValue(gameConfiguration.imageQuestions);
  setAllowOpsValue(gameConfiguration.songConfiguration.allowOps);
  setAllowEdsValue(gameConfiguration.songConfiguration.allowEds);
  setAllowInsValue(gameConfiguration.songConfiguration.allowIns);
  setAllowTvValue(gameConfiguration.allowTv);
  setAllowMovieValue(gameConfiguration.allowMovie);
  setAllowMusicValue(gameConfiguration.allowMusic);
  setAllowOvaValue(gameConfiguration.allowOva);
  setAllowSpecialValue(gameConfiguration.allowSpecial);
  setMinOpeningsValue(gameConfiguration.songConfiguration.minOpenings);
  setMinEndingsValue(gameConfiguration.songConfiguration.minEndings);
  setMinInsertsValue(gameConfiguration.songConfiguration.minInserts);
  setSongDifficultyRangeValues([gameConfiguration.songConfiguration.minSongDifficulty, gameConfiguration.songConfiguration.maxSongDifficulty]);
  setSongQuestionsInListValue(gameConfiguration.songConfiguration.songQuestionsInList);
  setSongQuestionsNotInListValue(gameConfiguration.songConfiguration.songQuestionsRandom);
  setSongQuestionsRandomValue(gameConfiguration.songConfiguration.songQuestionsRandom);
  setImageQuestionsInListValue(gameConfiguration.imageConfiguration.imageQuestionsInList);
  setImageQuestionsNotInListValue(gameConfiguration.imageConfiguration.imageQuestionsNotInList);
  setImageQuestionsRandomValue(gameConfiguration.imageConfiguration.imageQuestionsRandom);
  setAllowRelatedAnswersValue(gameConfiguration.allowRelatedAnswers);
  setForceIncludeGenresValue(gameConfiguration.forceIncludeGenres);
  setForceExcludeGenresValue(gameConfiguration.forceExcludeGenres);
  setAnimeUserScoresRangeValues([gameConfiguration.minUserScore, gameConfiguration.maxUserScore]);
}

useEffect(() => {
    loadPresets();
  }, [])

  useEffect(() => {
    if(!isLobbyLeader)
    {
      setAllConfigurationValues(gameConfiguration);
    }
    else
    {
      updateGameSettings(gameConfiguration);
    }
  }, [JSON.stringify(gameConfiguration)])

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
                <Text size="sm">{t('BonusTimePerQuestionLabel')}</Text>
                <Slider value={questionBonusTimeValue} onChangeEnd={handleBonusTimeRangeChange} label={(value) => `${value} sec`} min={0} max={5} />
                <Text size="sm">{t('NumberOfQuestionsLabel')}</Text>
                <Slider disabled={!isLobbyLeader} value={questionNumberValue} onChangeEnd={handleQuestionNumberRangeChange} label={(value) => `${value}`} min={5} max={30} marks={[{ value: 5 }, { value: 20 }, { value: 30 }]} />
              </Fieldset>
              <Fieldset legend={t('QuizTypesSettingsLabel')} className={classes.settingsFieldset}>
                <Text size="sm">{t('ImageQuestionsLabel')}</Text>
                <Slider disabled={!isLobbyLeader} value={imageQuestionsValue} onChangeEnd={handleImageQuestionsRangeChange} label={(value) => `${value}`} min={0} max={questionNumberValue} />
                <Text size="sm">{t('SongQuestionsLabel')}</Text>
                <Slider disabled={!isLobbyLeader} value={questionNumberValue - imageQuestionsValue} onChangeEnd={handleSongQuestionsRangeChange} label={(value) => `${value}`} min={0} max={questionNumberValue}/>
              </Fieldset>
              <Fieldset disabled={!isLobbyLeader} legend={t('FilteringSettingsLabel')} className={classes.settingsFieldset}>
                <Text size="sm">{t('AnimeYearsRangeLabel')}</Text>
                <RangeSlider disabled={!isLobbyLeader} value={animeYearsRangeValues} onChangeEnd={handleAllowedYearsRangeChange} min={1970} max={2025} minRange={1}/>
                <Text size="sm">{t('AnimeRatingsRangeLabel')}</Text>
                <RangeSlider disabled={!isLobbyLeader} value={animeRatingsRangeValues} onChangeEnd={handleAllowedRatingRangeChange} min={0} max={10} minRange={1}/>
                <Text size="sm">{t('AnimeUserScoresRangeLabel')}</Text>
                <RangeSlider value={animeUserScoresRangeValues} onChangeEnd={handleAnimeUserScoresRangeChange} min={0} max={10} minRange={1}/>
              </Fieldset>
              <Fieldset legend={t('AllowedAnimeTypesSettingsLabel')} className={classes.settingsFieldset}>
                <Checkbox disabled={!isLobbyLeader} label={t('AllowTvLabel')} checked={allowTvValue} onChange={(event) => handleAllowTvChange(event.currentTarget.checked)}/>
                <Checkbox disabled={!isLobbyLeader} label={t('AllowMovieLabel')} checked={allowMovieValue} onChange={(event) => handleAllowMovieChange(event.currentTarget.checked)}/>
                <Checkbox disabled={!isLobbyLeader} label={t('AllowOvaLabel')} checked={allowOvaValue} onChange={(event) => handleAllowOvaChange(event.currentTarget.checked)}/>
                <Checkbox disabled={!isLobbyLeader} label={t('AllowSpecialLabel')} checked={allowSpecialValue} onChange={(event) => handleAllowSpecialChange(event.currentTarget.checked)}/>
                <Checkbox disabled={!isLobbyLeader} label={t('AllowMusicLabel')} checked={allowMusicValue} onChange={(event) => handleAllowMusicChange(event.currentTarget.checked)}/>
                <Divider/>
                <MultiSelect
                  disabled={!isLobbyLeader}
                  checkIconPosition="right"
                  data={GetAllAnimeGenres()}
                  label={t('ForceIncludeGenreSelectLabel')}
                  value={forceIncludeGenresValue}
                  onChange={handleForceIncludeGenresChange}
                  placeholder={t('ForceIncludeGenrePlaceholder')}
                  w={200}
                />
                <MultiSelect
                  disabled={!isLobbyLeader}
                  checkIconPosition="right"
                  data={GetAllAnimeGenres()}
                  label={t('ForceExcludeGenreSelectLabel')}
                  value={forceExcludeGenresValue}
                  onChange={handleForceExcludeGenresChange}
                  placeholder={t('ForceExcludeGenrePlaceholder')}
                  w={200}
                />
              </Fieldset>
              <Fieldset disabled={imageQuestionsValue == questionNumberValue || !isLobbyLeader} legend={t('AllowedSongTypesSettingsLabel')} className={classes.settingsFieldset}>
                <Checkbox disabled={imageQuestionsValue == questionNumberValue || !isLobbyLeader || (!allowEdsValue && !allowInsValue)} label={t('AllowOpsLabel')} checked={allowOpsValue} onChange={(event) => handleAllowOpsChange(event.currentTarget.checked)}/>
                <Checkbox disabled={imageQuestionsValue == questionNumberValue || !isLobbyLeader || (!allowOpsValue && !allowInsValue)} label={t('AllowEdsLabel')} checked={allowEdsValue} onChange={(event) => handleAllowEdsChange(event.currentTarget.checked)}/>
                <Checkbox disabled={imageQuestionsValue == questionNumberValue || !isLobbyLeader || (!allowEdsValue && !allowOpsValue)} label={t('AllowInsLabel')} checked={allowInsValue} onChange={(event) => handleAllowInsChange(event.currentTarget.checked)}/>
                <Text size="sm">{t('MinOpeningsLabel')}</Text>
                <Slider disabled={imageQuestionsValue == questionNumberValue || !isLobbyLeader} value={minOpeningsValue} onChangeEnd={handleMinOpeningsValueChange} min={0} max={questionNumberValue - imageQuestionsValue} label={(value) => `${value}`}/>
                <Text size="sm">{t('MinEndingsLabel')}</Text>
                <Slider disabled={imageQuestionsValue == questionNumberValue || !isLobbyLeader} value={minEndingsValue} onChangeEnd={handleMinEndingsValueChange} min={0} max={questionNumberValue - imageQuestionsValue} label={(value) => `${value}`}/>
                <Text size="sm">{t('MinInsertsLabel')}</Text>
                <Slider disabled={imageQuestionsValue == questionNumberValue || !isLobbyLeader} value={minInsertsValue} onChangeEnd={handleMinInsertsValueChange} min={0} max={questionNumberValue - imageQuestionsValue} label={(value) => `${value}`}/>
                <Text size="sm">{t('RandomSongsLabel')}</Text>
                <Slider disabled={imageQuestionsValue == questionNumberValue || !isLobbyLeader} value={randomSongsValue} onChangeEnd={handleRandomSongsValueChange} min={0} max={questionNumberValue - imageQuestionsValue} label={(value) => `${value}`}/>
              </Fieldset>
              <Fieldset disabled={imageQuestionsValue == questionNumberValue || !isLobbyLeader} legend={t('SongSettingsLabel')} className={classes.settingsFieldset}>
                <Text size="sm">{t('SongDifficultyRangeLabel')}</Text>
                <RangeSlider disabled={imageQuestionsValue == questionNumberValue || !isLobbyLeader} value={songDifficultyRangeValues} onChangeEnd={handleSongDifficultyRangeChange} min={0} max={100} minRange={1}/>
                <Text size="sm">{t('SongStartRangeLabel')}</Text>
                <RangeSlider disabled={imageQuestionsValue == questionNumberValue || !isLobbyLeader} value={songStartPercentValues} onChangeEnd={handleSongStartRangeChange} min={0} max={100} minRange={10}/>
                <Divider/>
                <Text size="sm">{t('SongsInListLabel')}</Text>
                <Slider disabled={imageQuestionsValue == questionNumberValue || !isLobbyLeader} value={songQuestionsInListValue} onChangeEnd={handleSongQuestionsInListValueChange} min={0} max={questionNumberValue - imageQuestionsValue} label={(value) => `${value}`}/>
                <Text size="sm">{t('SongsNotInListLabel')}</Text>
                <Slider disabled={imageQuestionsValue == questionNumberValue || !isLobbyLeader} value={songQuestionsNotInListValue} onChangeEnd={handleSongQuestionsNotInListValueChange} min={0} max={questionNumberValue - imageQuestionsValue} label={(value) => `${value}`}/>
                <Text size="sm">{t('SongsRandomListLabel')}</Text>
                <Slider disabled={true} value={songQuestionsRandomValue} min={0} max={questionNumberValue - imageQuestionsValue} label={(value) => `${value}`}/>
              </Fieldset>
              <Fieldset disabled={imageQuestionsValue == 0 || !isLobbyLeader} legend={t('ImageSettingsLabel')} className={classes.settingsFieldset}>
                <Text size="sm">{t('ImagesInListLabel')}</Text>
                <Slider disabled={imageQuestionsValue == 0 || !isLobbyLeader} value={imageQuestionsInListValue} onChangeEnd={handleImageQuestionsInListValueChange} min={0} max={imageQuestionsValue} label={(value) => `${value}`}/>
                <Text size="sm">{t('ImagesNotInListLabel')}</Text>
                <Slider disabled={imageQuestionsValue == 0 || !isLobbyLeader} value={imageQuestionsNotInListValue} onChangeEnd={handleImageQuestionsNotInListValueChange} min={0} max={imageQuestionsValue} label={(value) => `${value}`}/>
                <Text size="sm">{t('ImagesRandomListLabel')}</Text>
                <Slider disabled={true} value={imageQuestionsRandomValue} min={0} max={questionNumberValue - imageQuestionsValue} label={(value) => `${value}`}/>
              </Fieldset>
              <Fieldset disabled={!isLobbyLeader} legend={t('ExperimentalSettingsLabel')} className={classes.settingsFieldset}>
                <Checkbox
                  disabled={!isLobbyLeader}
                  label={t('AnimeDiversifyLabel')}
                  checked={diversifyAnimeValue}
                  onChange={(event) => handleDiversifyChange(event.currentTarget.checked)}
                />
                <Checkbox
                  disabled={!isLobbyLeader}
                  label={t('AnimeEqualizeLabel')}
                  checked={equalizeQuestionsValue}
                  onChange={(event) => handleEqualizeChange(event.currentTarget.checked)}
                />
                <Checkbox
                  disabled={!isLobbyLeader}
                  label={t('AnimeAllowRelatedLabel')}
                  checked={allowRelatedAnswersValue}
                  onChange={(event) => handleAllowRelatedAnswersChange(event.currentTarget.checked)}
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
                <Button loading={gameState == GameState.Starting} loaderProps={{ type: 'dots' }} onClick={() => handleReadyStatusChange(!isReady)}>{ isReady ? t('UnreadyButton') : t('ReadyButton')}</Button>
              </Group>
            </Group>
            <Group justify='flex-start' align='flex-end'>
              <Button disabled={gameState == GameState.Starting} onClick={() => leaveCurrentGame()}>{t('LeaveGameButton')}</Button>
            </Group>
          </Container>
        </Flex>
      </Paper>
      )
}