import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css';

import Dashboard from './pages/dashboard/Dashboard';
import Home from './pages/home/Home';

import firebaseAuth from './config/firebaseConfig';
import Signup from './components/modals/sign-up/Signup';
import Login from './components/modals/login/Login';

function App() {

  // console.log(firebaseAuth.currentUser);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
