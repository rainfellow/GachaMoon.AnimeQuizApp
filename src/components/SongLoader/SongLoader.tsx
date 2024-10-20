import { Flex, Loader, Image, Group } from "@mantine/core";
import { useContext, useEffect, useRef, useState } from "react";
import placeholder from '../../static/music_note.svg'
import { LocalSettingsContext } from "@/context/local-settings-context";
export const SongLoader = (props: {source: string, start: number, duration: number}) => {
    const player:HTMLAudioElement = document.querySelector(".anime_audio_player") as HTMLAudioElement;
    
    const { volume } = useContext(LocalSettingsContext);

    const [isLoading, setIsLoading] = useState(true);

    const play_audio = (audio_element: string) => {
        var player2:HTMLAudioElement = document.getElementById(audio_element) as HTMLAudioElement;
        if(player2 != null)
        {
            player2.volume = volume / 100;
            player2.currentTime = props.start;
            player2.play();
        }
      }

    const updatePlayerAudio = () => {
        if (player != null && player.currentTime - props.start >= props.duration) {
            player.removeAttribute('src');
            player.load();
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
        <div >
            <div style={{ display: isLoading ? 'block' : 'none' }}>
                <Loader />
            </div>
            <Flex style={{ display: isLoading ? 'none' : 'block' }} align='center' justify='center'>
                <Image src={placeholder} w={300} h={300}/>
                <audio
                    id="anime_audio_player"
                    hidden={true}
                    onTimeUpdate={updatePlayerAudio}
                    preload="auto"
                    crossOrigin="anonymous"
                    autoPlay={true}
                    controls={false}
                    onLoadedMetadata={() => { setIsLoading(false); play_audio('anime_audio_player')}}
                    src={props.source}
                />
                </Flex>
                
        </div>
    )
};