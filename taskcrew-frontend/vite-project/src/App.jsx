import{BrowserRouter as Router,Routes,Route,Navigate} from 'react-router-dom'
import './App.css'
import LandingPage from './components/LandingPage/LandingPage'
import LoginPage from './components/AuthPage/LoginPage'
import SignupPage from './components/AuthPage/SignUpPage'
import CreateSpacePage from './components/ProjectCreation/CreatSpacePage'
import ProtectedRoute from './components/ProtectedRoute'
import ProjectSpacePage from './components/ProjectPage/ProjectSpacePage'

function App() {

  return (
   <Router>
    <Routes>
      <Route path="/" element={<LandingPage></LandingPage>}></Route>
      <Route path="/signin" element={<SignupPage></SignupPage>}></Route>
      <Route path='/login' element={<LoginPage></LoginPage>}></Route>
      <Route path='/createSpace' element={<ProtectedRoute><CreateSpacePage /></ProtectedRoute>}></Route>
      <Route path='/projectSpace' element={<ProtectedRoute><ProjectSpacePage /></ProtectedRoute>}></Route>
      <Route path='/projectSpace/:projectId' element={<ProtectedRoute><ProjectSpacePage /></ProtectedRoute>}></Route>
    </Routes>
   </Router>
  )
}

export default App
