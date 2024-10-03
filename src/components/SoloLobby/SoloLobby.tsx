import React, { Suspense } from 'react'
// routes config
import { SoloGameContextProvider } from '../../context/solo-game-context'
import { AnimeContextProvider } from '@/context/anime-context';
import { SoloLobbyView } from '../../views/SoloLobby/SoloLobbyView';

const SoloLobby = () => {

  return (
      <AnimeContextProvider>
          <SoloGameContextProvider>
              <SoloLobbyView/>
          </SoloGameContextProvider>
      </AnimeContextProvider>
  )
}

export default React.memo(SoloLobby)
