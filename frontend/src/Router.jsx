import React from 'react'
import { Route,Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Preview from './Perview'
import JoinedRoom from './pages/JoinedRoom'

export default function Router() {
  return (
        <Routes>
            <Route path='/' element= {<HomePage/>} />
            <Route path='/Preview/:id' element= {<Preview/>} />
            <Route path='/:id' element=  {<JoinedRoom/>} />
            

        </Routes>
  )
}
