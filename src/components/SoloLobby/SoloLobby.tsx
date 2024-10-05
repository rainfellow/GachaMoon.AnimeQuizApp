import React, { Suspense } from 'react'
// routes config
import { SoloGameContextProvider } from '../../context/solo-game-context'
import { AnimeContextProvider } from '@/context/anime-context';
import { SoloLobbyView } from '../../views/SoloLobby/SoloLobbyView';

const SoloLobby = () => {

  return (
    <SoloGameContextProvider>
        <SoloLobbyView/>
    </SoloGameContextProvider>
  )
}

export default React.memo(SoloLobby)
