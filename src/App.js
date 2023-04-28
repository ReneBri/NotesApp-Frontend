import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css';

import Dashboard from './pages/dashboard/Dashboard';
import Home from './pages/home/Home';

import firebaseAuth from './config/firebaseConfig';
import Signup from './components/sign-up/Signup';
import Login from './components/login/Login';

function App() {

  // console.log(firebaseAuth.currentUser);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
