import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSidebar from './LeftSidebar'

const MainLayout = () => {
  return (
    <div>
      <div className='hidden md:block'>
        <LeftSidebar/>
      </div>
        <div>
            <Outlet/>
        </div>
    </div>
  )
}

export default MainLayout