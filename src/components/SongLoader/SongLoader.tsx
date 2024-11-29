import { Flex, Loader, Image, Group } from "@mantine/core";
import { useContext, useEffect, useRef, useState } from "react";
import placeholder from '../../static/music_note.svg'
import { LocalSettingsContext } from "@/context/local-settings-context";
import { useViewportSize } from "@mantine/hooks";
export const SongLoader = (props: {source: string, start: number, duration: number}) => {
    const player:HTMLAudioElement = document.querySelector(".anime_audio_player") as HTMLAudioElement;
    
    const { volume } = useContext(LocalSettingsContext);

    const [isLoading, setIsLoading] = useState(true);    
    
    const { height, width } = useViewportSize();

    const calcImageWidth = (viewPortWidth: number) => {
      return Math.min(1280, Math.max(640, viewPortWidth / 2.5));
    }
    const calcImageHeight = (viewPortWidth: number) => {
        return Math.min(720, Math.max(360, viewPortWidth * 9 / (2.5 * 16)));
    }

    const calcPlaceholderSize = (viewPortWidth: number) => {
        return Math.min(300, Math.max(140, viewPortWidth / 5));
    }

    const play_audio = (audio_element: string) => {
        var player2:HTMLAudioElement = document.getElementById(audio_element) as HTMLAudioElement;
        if(player2 != null)
        {
            player2.volume = volume / 100;
            player2.currentTime = props.start;
            player2.play();
        }
      }

    const updatePlayerAudio = (audio_element: string) => {
        var player2:HTMLAudioElement = document.getElementById(audio_element) as HTMLAudioElement;
        if (player2 != null && player2.currentTime - props.start >= props.duration && !player2.paused)
        {
            player2.pause();
            player2.removeAttribute('src');
            player2.load();
        }
    }

    useEffect(() => {
        var player2:HTMLAudioElement = document.getElementById('anime_audio_player') as HTMLAudioElement;
        if(player2 != null)
        {
            player2.volume = volume / 100;
        }
    }, [volume]);

    return (      
        <Flex
        w={calcImageWidth(width)} h={calcImageHeight(width)}
        justify="center"
        align="center"
        direction="column"
        wrap="wrap"
        >
            <div style={{ display: isLoading ? 'block' : 'none' }}>
                <Loader />
            </div>
            <div style={{ display: isLoading ? 'none' : 'block' }}>
                <Image src={placeholder} w={calcPlaceholderSize(width)} h={calcPlaceholderSize(width)}/>
                { <audio
                    id="anime_audio_player"
                    hidden={true}
                    onTimeUpdate={() => updatePlayerAudio('anime_audio_player')}
                    preload="auto"
                    crossOrigin="anonymous"
                    autoPlay={true}
                    controls={false}
                    onLoadedMetadata={() => { setIsLoading(false); play_audio('anime_audio_player')}}
                    src={props.source}
                /> }
                </div>
                
        </Flex>
    )
};