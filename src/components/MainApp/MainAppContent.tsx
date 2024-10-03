import React, { Suspense } from 'react'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
// routes config
import { Loader } from '@mantine/core';

const AppContent = () => {

  return (
    <div>
      <Suspense fallback={<Loader color="primary" />}>
        <Outlet/>
      </Suspense>
    </div>
  )
}

export default React.memo(AppContent)
