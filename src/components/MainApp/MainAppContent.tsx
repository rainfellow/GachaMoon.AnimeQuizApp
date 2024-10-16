import React, { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
// routes config
import { Loader } from '@mantine/core';
import { AnimeContextProvider } from '@/context/anime-context';
import { Notifications } from '@mantine/notifications';
import classes from './MainAppContent.module.css'

const MainAppContent = () => {

  return (
    <div className={classes.content}>
      <Suspense fallback={<Loader color="primary" />}>
        <AnimeContextProvider>
          <Notifications />
          <Outlet/>
        </AnimeContextProvider>
      </Suspense>
    </div>
  )
}

export default React.memo(MainAppContent)
