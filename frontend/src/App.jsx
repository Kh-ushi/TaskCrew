import './App.css';
import ProtectedRoute from './ProtectedRoute/ProtectedRoute';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import LandingPage from './components/LandingPage/LandingPage';
import SignupForm from './components/Forms/SignupForm';
import LoginForm from './components/Forms/LoginForm';
import ProjectPage from './components/Project/ProjectPage';
import {BrowserRouter as Router,Routes,Route,Link} from "react-router-dom";

function App() {

  return (
    <Router>
      <Routes>
      <Route path='/' element={<LandingPage></LandingPage>}></Route>
      <Route path='/dashboard' element={<ProtectedRoute><AdminDashboard></AdminDashboard></ProtectedRoute>}></Route>
      <Route path='/signUp' element={<SignupForm></SignupForm>}></Route>
      <Route path='/login' element={<LoginForm></LoginForm>}></Route>
      <Route path='/projects' element={<ProtectedRoute><ProjectPage></ProjectPage></ProtectedRoute>}></Route>

      </Routes>
    </Router>
  )
}

export default App;
