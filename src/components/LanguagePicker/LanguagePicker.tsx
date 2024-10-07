import { useState } from 'react';
import { UnstyledButton, Menu, Group } from '@mantine/core';
import { LuChevronDown } from 'react-icons/lu';
import Flag from 'react-flagkit';

import classes from './LanguagePicker.module.css';

const data = [
  { label: 'English', code: 'en', flagCode: 'GB' },
  { label: 'Russian', code: 'ru', flagCode: 'RU' },
  { label: 'Chinese', code: 'zh', flagCode: 'CN' },
  { label: 'Spanish', code: 'es', flagCode: 'ES' },
  { label: 'Korean', code: 'ko', flagCode: 'KR' },
  { label: 'Thai', code: 'th', flagCode: 'TH' },
  { label: 'Vietnamese', code: 'vi', flagCode: 'VN' },
  { label: 'Ukrainian', code: 'uk', flagCode: 'UA' },
];

const findDataByCode = (code: string) => {
  return data.find((value) => value.code == code) ?? data[0]
}

export function LanguagePicker(props: { selectedCode: string, onLanguageSelected: (language: string) => void }) {
  const [opened, setOpened] = useState(false);
  const [selected, setSelected] = useState(findDataByCode(props.selectedCode));
  const items = data.map((item) => (
    <Menu.Item
      leftSection={<Flag country={item.flagCode} size={18}/>}
      onClick={(event) => { event.preventDefault(); setSelected(item); props.onLanguageSelected(item.code) }}
      key={item.label}
    >
      {item.label}
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
            <span className={classes.label}>{selected.label}</span>
          </Group>
          <LuChevronDown size="1rem" className={classes.icon}/>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>{items}</Menu.Dropdown>
    </Menu>
  );
}