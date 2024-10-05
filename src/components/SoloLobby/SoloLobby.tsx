import React from 'react'
// routes config
import { SoloGameContextProvider } from '../../context/solo-game-context'
import { SoloLobbyView } from '../../views/SoloLobby/SoloLobbyView';

const SoloLobby = () => {

  return (
    <SoloGameContextProvider>
        <SoloLobbyView/>
    </SoloGameContextProvider>
  )
}

export default React.memo(SoloLobby)
