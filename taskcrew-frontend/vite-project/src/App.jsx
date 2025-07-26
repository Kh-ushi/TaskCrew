import { useState } from 'react'
import './App.css'
import LandingPage from './components/LandingPage/LandingPage'
import LoginPage from './components/AuthPage/LoginPage'
import SignupPage from './components/AuthPage/SignUpPage'

function App() {

  return (
    <>
     {/* <LandingPage></LandingPage>   */}
     {/* <LoginPage></LoginPage> */}
     <SignupPage></SignupPage>
    </>
  )
}

export default App
