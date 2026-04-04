import React from 'react'
import { Route,Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Preview from './Perview'

export default function Router() {
  return (
        <Routes>
            <Route path='/' element= {<HomePage/>} />
            <Route path='/Preview/:id' element= {<Preview/>} />
            <Route path='/:id' element=  {<h1>USER JIONED THE ROOM</h1>} />
            

        </Routes>
  )
}
