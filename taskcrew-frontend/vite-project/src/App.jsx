import{BrowserRouter as Router,Routes,Route,Navigate} from 'react-router-dom'
import './App.css';
import AuthModal from './components/AuthModal/AuthModal';
import AllProjects from './components/AllProjects/AllProjects';
import AllOrganizations from './components/AllOrganizations/AllOrganizations';
import ProtectedRoute from './utils/ProtectedRoute';
import MySpacesPage from './components/MySpaces/MySpacesPage';
import SpacePage from './components/SpacePage/SpacePage';
import AddProjectModal from './components/AddProjectModal/AddProjectModal';

function App() {

  return (
   <Router>
    <Routes> 
    <Route path="/" element={<AuthModal onOrgSignup={false} />} ></Route>
    <Route path="/registerOrg" element={<AuthModal onOrgSignup={true} />} ></Route>
    <Route path='/allProjects' element={<ProtectedRoute><AllProjects></AllProjects></ProtectedRoute>}></Route>
    <Route path='/allOrganizations' element={<ProtectedRoute><AllOrganizations></AllOrganizations></ProtectedRoute>}></Route>
    <Route path='/org/:id' element={<ProtectedRoute><MySpacesPage></MySpacesPage></ProtectedRoute>}></Route>
     <Route path='/addNewOrg' element={<ProtectedRoute><AuthModal onOrgSignup={true} onRegister={false}></AuthModal></ProtectedRoute>}></Route>
     <Route path='/space/:id' element={<ProtectedRoute><SpacePage></SpacePage></ProtectedRoute>}></Route>
     <Route path='/addProject' element={<ProtectedRoute><AddProjectModal></AddProjectModal></ProtectedRoute>}></Route>
    </Routes>
   </Router>
  )
}

export default App
