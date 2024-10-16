import { LocalGameSettingsPresets } from "@/models/GameplaySettings";
import { ActionIcon, Drawer, Group, ScrollArea, Stack, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CiFileOn, CiTrash } from "react-icons/ci";

export function SettingsPresetsDrawer(props: {presets: LocalGameSettingsPresets, onloadPreset: (p: string) => void, onDeletePreset: (p: string) => void, opened: boolean, onClose: () => void }) {
    const [drawerPresetElements, setDrawerPresetElements] = useState<JSX.Element[]>();
    const { t } = useTranslation('game');

    const updateDrawerData = (configPresets: LocalGameSettingsPresets) => {
        const data = configPresets.presets.keys().map((k) => 
        <Group justify='space-between' key={k}>
          <Group justify='flex-start'>
            <Text>
              {k}
            </Text>
          </Group>
          <Group justify='flex-end'>
            <ActionIcon id={k+"_load_button"} variant="filled" aria-label="Load" onClick={() => props.onloadPreset(k)}>
              <CiFileOn/>
            </ActionIcon>
            <ActionIcon id={k+"_delete_button"} variant="filled" color="red" aria-label="Delete" onClick={() => { props.onDeletePreset(k); updateDrawerData(props.presets);}}>
              <CiTrash/>
            </ActionIcon>
          </Group>
        </Group>
          )
        setDrawerPresetElements(data.toArray());
      } 

    useEffect(() => {
        updateDrawerData(props.presets);
    }, [props])

    return (
        <Drawer offset={8} radius="md" opened={props.opened} onClose={props.onClose} title={t('game:PresetsDrawerTitle')} scrollAreaComponent={ScrollArea.Autosize}>
          <Stack justify='flex-start'>
            <Text c='dimmed' size='xs'>{t('game:PresetsDrawerDescription')}</Text>
            {props.presets != undefined && drawerPresetElements}
          </Stack>
        </Drawer>
    );
}