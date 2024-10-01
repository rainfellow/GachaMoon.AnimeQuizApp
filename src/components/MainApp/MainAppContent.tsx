import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
// routes config
import { SoloGameContextProvider } from '../../context/solo-game-context'
import { Loader } from '@mantine/core';
import { AnimeContextProvider } from '@/context/anime-context';
import { SoloLobbyView } from '../SoloLobbyView/SoloLobbyView';

const AppContent = () => {

  return (
    <div>
      <Suspense fallback={<Loader color="primary" />}>
        <Routes>
          <Route path="/" element={<Navigate to="/" replace />} />
            <Route path="/sololobby" element={
                <AnimeContextProvider>
                    <SoloGameContextProvider>
                        <SoloLobbyView/>
                    </SoloGameContextProvider>
                </AnimeContextProvider>}/>
        </Routes>
      </Suspense>
    </div>
  )
}

export default React.memo(AppContent)
