import React from 'react'
import { Outlet } from 'react-router-dom'
import AppTopBar from '../AppTopBar/AppTopBar'

const AppLayout = () => {

  return (
    <>
      <AppTopBar />
      <Outlet />
    </>
  )
}

export default AppLayout