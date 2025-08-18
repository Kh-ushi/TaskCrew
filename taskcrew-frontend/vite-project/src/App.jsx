import{BrowserRouter as Router,Routes,Route,Navigate} from 'react-router-dom'
import './App.css';
import AuthModal from './components/AuthModal/AuthModal';
import AllProjects from './components/AllProjects/AllProjects';
import AllOrganizations from './components/AllOrganizations/AllOrganizations';
import ProtectedRoute from './utils/ProtectedRoute';

function App() {

  return (
   <Router>
    <Routes>
    <Route path="/" element={<AuthModal onOrgSignup={false} />} ></Route>
    <Route path='/allProjects' element={<ProtectedRoute><AllProjects></AllProjects></ProtectedRoute>}></Route>
    <Route path='/allOrganizations' element={<ProtectedRoute><AllOrganizations></AllOrganizations></ProtectedRoute>}></Route>
    </Routes>
   </Router>
  )
}

export default App
