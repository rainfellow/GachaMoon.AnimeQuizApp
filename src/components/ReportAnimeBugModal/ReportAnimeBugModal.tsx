import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, NativeSelect, Stack, Fieldset, TextInput, Group, Text } from '@mantine/core';
import { AnimeData } from '@/models/Anime';
import { useTranslation } from 'react-i18next';
import { useAxios } from '@/hooks/use-axios';
import { useEffect, useState } from 'react';
import { LanguagePicker } from '../LanguagePicker/LanguagePicker';

export function ReportAnimeBugModal(props: {anime: AnimeData, opened: boolean, onClose: () => void, close: () => void}) {
  const axios = useAxios();
  const { t } = useTranslation('game, common');
  const [bugTypeValue, setBugTypeValue] = useState("None");
  const [selectedAlias, setSelectedAlias] = useState("");
  const [selectedLanguageCode, setSelectedLanguageCode] = useState('en');
  const [suggestedTitle, setSuggestedTitle] = useState('');
  const [aliasStrings, setAliasStrings] = useState((props.anime.aliases.map((x) => x.alias)));

  const handleReportButtonClick = () => {
    let request = {suggestedAlias: "", suggestedLanguage: "", reportType: 0, aliasId: 0}
    switch(bugTypeValue) { 
        case "MissingTitle": { 
            request.reportType = 1;
            request.suggestedAlias = suggestedTitle;
            request.suggestedLanguage = selectedLanguageCode;
            break; 
        } 
        case "WrongTitle": { 
            request.reportType = 2;
            request.aliasId = props.anime.aliases.find((x) => x.alias == selectedAlias)?.aliasId ?? 0;
            break; 
        } 
        case "WrongLanguage": { 
            request.reportType = 3;
            request.aliasId = props.anime.aliases.find((x) => x.alias == selectedAlias)?.aliasId ?? 0;
            request.suggestedLanguage = selectedLanguageCode;
          break; 
        } 
        default: { 
            console.log('failed bug submission')
            return; 
        } 
    } 
    if ((request.aliasId != 0 || request.reportType == 1) && request.reportType != 0)
    {
        axios
            .post(`/BugReports/alias/submit`, request)
            .then(() => {
                props.close()
            })
    }
    else
    {
        console.log('failed bug submission')
    }
  }

  const InputElement = () => {
    return(
        <>
        {
            bugTypeValue == "MissingTitle" && 
            <Fieldset legend="">
                <Stack align='space-around'>
                    <Group justify='space-between'>
                        <Text c='dimmed'>{t('common:EnterTitleTitle')}</Text>
                        <TextInput 
                            label={t('')} 
                            value={suggestedTitle} 
                            onChange={(event) => {
                                event.preventDefault();
                                setSuggestedTitle(event.currentTarget.value);
                              }}/>
                    </Group>
                    <Group justify='space-between'>
                    <Text c='dimmed'>{t('common:SelectLanguageTitle')}</Text>
                        <LanguagePicker selectedCode={selectedLanguageCode} onLanguageSelected={setSelectedLanguageCode}/>
                    </Group>
                </Stack>
            </Fieldset>
        }
        {
            bugTypeValue == "WrongTitle" && 
            <Fieldset legend="">
                <Stack align='space-around'>
                    <NativeSelect
                        description={t('game:ReportAnimeBugModalSelectAliasLabel')}
                        value={selectedAlias}
                        onChange={(event) => setSelectedAlias(event.currentTarget.value)}
                        data={aliasStrings}
                    />
                </Stack>
            </Fieldset>
        }
        {
            bugTypeValue == "WrongLanguage" && 
            <Fieldset legend="">
                <Stack align='space-around'>
                    <NativeSelect
                        description={t('game:ReportAnimeBugModalSelectAliasLabel')}
                        value={selectedAlias}
                        onChange={(event) => setSelectedAlias(event.currentTarget.value)}
                        data={aliasStrings}
                    />
                    <Group justify='space-between'>
                        <Text c='dimmed'>{t('common:SelectLanguageTitle')}</Text>
                        <LanguagePicker selectedCode={selectedLanguageCode} onLanguageSelected={setSelectedLanguageCode}/>
                    </Group>
                </Stack>
            </Fieldset>
        }
        </>
    )
  }

  useEffect(() => {
    setBugTypeValue("None");
    setSelectedAlias("");
    setSelectedLanguageCode("en");
    setSuggestedTitle("");
    setAliasStrings(props.anime.aliases.map((x) => x.alias))
  }, [props.anime]);

  return (
      <Modal opened={props.opened} onClose={() => { props.onClose(); props.close() }} title={t('game:ReportAnimeBugModalTitle')} centered>
        <Stack>
        <NativeSelect
            description={t('game:ReportAnimeBugModalBugTypeLabel')}
            value={bugTypeValue}
            onChange={(event) => setBugTypeValue(event.currentTarget.value)}
            data={[
                { label: t('game:AnimeBugTypePleaseSelect'), value: "None", disabled:true },
                { label: t('game:AnimeBugTypeMissing'), value: "MissingTitle" },
                { label: t('game:AnimeBugTypeWrongTitle'), value: "WrongTitle" },
                { label: t('game:AnimeBugTypeWrongTitleLang'), value: "WrongLanguage", },
            ]}
        />
        <InputElement/>
        <Button color='red' disabled={bugTypeValue == "None"} onClick={handleReportButtonClick}>{t('game:SendBugReportButton')}</Button>
        </Stack>
      </Modal>
  );
}