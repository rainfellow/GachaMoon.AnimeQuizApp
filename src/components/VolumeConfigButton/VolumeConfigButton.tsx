import { Popover, ActionIcon, rem, Radio, Stack, Group, UnstyledButton, Slider } from '@mantine/core';
import { useContext, useState } from 'react';
import { LocalSettingsContext } from '@/context/local-settings-context';
import { CiVolume, CiVolumeHigh, CiVolumeMute } from 'react-icons/ci';

export function VolumeConfigButton() {
    const [opened, setOpened] = useState(false);
    const { volume, setVolume } = useContext(LocalSettingsContext);

    const handlePopoverChange = () => {
        setOpened((value) => !value);
    }  

    return (
    <Popover trapFocus position="bottom" withArrow shadow="md" opened={opened}>
        <Popover.Target>
        <UnstyledButton onClick={() => { handlePopoverChange() }}>
          <Group gap="xs">
            {volume == 0 ? <CiVolumeMute size={22}/> : 
             volume < 60 ? <CiVolume size={22}/> : <CiVolumeHigh size={22}/>}
          </Group>
        </UnstyledButton>
        </Popover.Target>
        <Popover.Dropdown>
            <div style={{width:'150px'}}>
              <Slider value={volume} onChange={(value) => {setVolume(value as number)}} min={0} max={100} />
            </div>
        </Popover.Dropdown>
    </Popover>
  );
}