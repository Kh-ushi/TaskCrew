import './App.css';
import {BrowserRouter as Router,Routes,Route,Navigate} from "react-router-dom";
import ProtectedRoute from './components/Authentication/ProtectedRoute';

import Signup from './components/Authentication/Signup';
import Login from './components/Authentication/Login';
import Organizations from './components/Organization/Organizations';
import Spaces from './components/Spaces/Spaces';
import SingleSpace from './components/Spaces/SingleSpace';

function App() {

  return (
   <Router>
    <Routes>
      <Route path='/' element={<Navigate to="/login"/>}></Route>
      <Route path='/register' element={<Signup></Signup>}></Route>
      <Route path='/login' element={<Login></Login>}></Route>
      <Route path='/organizations' element={<ProtectedRoute><Organizations></Organizations></ProtectedRoute>}></Route>
      <Route path='/organizations/:id' element={<ProtectedRoute><Spaces></Spaces></ProtectedRoute>}></Route>
      <Route path='/space/:id' element={<SingleSpace></SingleSpace>}></Route>
    </Routes>
   </Router>
  )
}

export default App
