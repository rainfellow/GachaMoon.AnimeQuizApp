import React, { Suspense } from 'react'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
// routes config
import { Loader } from '@mantine/core';
import { AnimeContextProvider } from '@/context/anime-context';

const AppContent = () => {

  return (
    <div>
      <Suspense fallback={<Loader color="primary" />}>
      <AnimeContextProvider>
          <Outlet/>
        </AnimeContextProvider>
      </Suspense>
    </div>
  )
}

export default React.memo(AppContent)
