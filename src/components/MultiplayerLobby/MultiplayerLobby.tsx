import { MultiplayerGameContextProvider } from '@/context/multiplayer-game-context'
import { MultiplayerLobbyView } from '@/views/MultiplayerLobbyView/MultiplayerLobbyView'
import React from 'react'
// routes config

const MultiplayerLobby = () => {

  return (
    <MultiplayerGameContextProvider>
        <MultiplayerLobbyView/>
    </MultiplayerGameContextProvider>
  )
}

export default React.memo(MultiplayerLobby)
