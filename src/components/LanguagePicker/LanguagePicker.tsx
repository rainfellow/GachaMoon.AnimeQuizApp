import { useState } from 'react';
import { UnstyledButton, Menu, Group } from '@mantine/core';
import { LuChevronDown } from 'react-icons/lu';
import Flag from 'react-flagkit';

import classes from './LanguagePicker.module.css';
import { useTranslation } from 'react-i18next';

const data = [
  { label: 'LanguageNameEn', code: 'en', flagCode: 'GB' },
  { label: 'LanguageNameRu', code: 'ru', flagCode: 'RU' },
  { label: 'LanguageNameZh', code: 'zh', flagCode: 'CN' },
  { label: 'LanguageNameEs', code: 'es', flagCode: 'ES' },
  { label: 'LanguageNameKo', code: 'ko', flagCode: 'KR' },
  { label: 'LanguageNameTh', code: 'th', flagCode: 'TH' },
  { label: 'LanguageNameVi', code: 'vi', flagCode: 'VN' },
  { label: 'LanguageNameUk', code: 'uk', flagCode: 'UA' },
];

const findDataByCode = (code: string) => {
  return data.find((value) => value.code == code) ?? data[0]
}

export function LanguagePicker(props: { selectedCode: string, onLanguageSelected: (language: string) => void }) {
  const [opened, setOpened] = useState(false);
  const [selected, setSelected] = useState(findDataByCode(props.selectedCode));
  const { t } = useTranslation('common');
  const items = data.map((item) => (
    <Menu.Item
      leftSection={<Flag country={item.flagCode} size={18}/>}
      onClick={(event) => { event.preventDefault(); setSelected(item); props.onLanguageSelected(item.code) }}
      key={item.label}
    >
      {t(item.label)}
    </Menu.Item>
  ));

  return (
    <Menu
      onOpen={() => setOpened(true)}
      onClose={() => setOpened(false)}
      radius="md"
      width="target"
      withinPortal
    >
      <Menu.Target>
        <UnstyledButton className={classes.control} data-expanded={opened || undefined}>
          <Group gap="xs">
            <Flag country={selected.flagCode} size={22}/>
            <span className={classes.label}>{t(selected.label)}</span>
          </Group>
          <LuChevronDown size="1rem" className={classes.icon}/>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>{items}</Menu.Dropdown>
    </Menu>
  );
}