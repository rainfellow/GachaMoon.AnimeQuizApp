import { Modal, Button, Fieldset, TextInput, Group, Stack } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { GameConfiguration } from '@/models/GameConfiguration';

export function SavePresetModal(props: {preset: GameConfiguration, opened: boolean, onSave: (presetName: string, preset: GameConfiguration) => void, close: () => void}) {
  const { t } = useTranslation('game');
  const [presetName, setPresetName] = useState('');

  return (
      <Modal opened={props.opened} onClose={() => { props.close() }} title={t('game:PresetModalTitle')} centered>
        <Fieldset legend="">
            <Group gap='xs' justify='space-between'>
                <TextInput 
                    value={presetName} 
                    onChange={(event) => {
                        event.preventDefault();
                        setPresetName(event.currentTarget.value);
                        }}/>
                <Group justify='flex-end'>
                    <Button onClick={() => { props.onSave(presetName, props.preset); props.close(); }}>{t('game:PresetModalButton')}</Button>
                </Group>
            </Group>
        </Fieldset>
      </Modal>
  );
}