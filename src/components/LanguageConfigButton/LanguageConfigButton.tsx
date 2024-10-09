import { Popover, ActionIcon, rem, Radio, Stack, Group, UnstyledButton } from '@mantine/core';
import { useContext, useState } from 'react';
import { LocalSettingsContext } from '@/context/local-settings-context';
import Flag from 'react-flagkit';
import { useTranslation } from 'react-i18next';

const data = [
    { code: 'en', flagCode: 'GB' },
    { code: 'ru', flagCode: 'RU' },
  ];

export function LanguageConfigButton() {
    const [opened, setOpened] = useState(false);
    const { language, setLanguage } = useContext(LocalSettingsContext);
    const { i18n } = useTranslation();

    const getFlagCode = (language: string) => {
        return data.find((value) => value.code == language)?.flagCode ?? "GB";
    }
    const handlePopoverChange = () => {
        setOpened((value) => !value);
    }  
    const items = data.map((item) => (
        <div
          onClick={() => { setLanguage(item.code); i18n.changeLanguage(item.code); setOpened(false); }}
          key={item.code}
        >
          <Flag country={item.flagCode} size={18}/>
        </div>
      ));
    return (
    <Popover trapFocus position="bottom" withArrow shadow="md" opened={opened}>
        <Popover.Target>
        <UnstyledButton onClick={() => { handlePopoverChange() }}>
          <Group gap="xs">
            <Flag country={getFlagCode(language)} size={22}/>
          </Group>
        </UnstyledButton>
        </Popover.Target>
        <Popover.Dropdown>
            <Stack justify='flex-start'>
                {items}
            </Stack>
        </Popover.Dropdown>
    </Popover>
  );
}