import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ReactDOM from 'react-dom';
import { useContext, useEffect, useState } from 'react';
import './App.css';

import Dashboard from './pages/dashboard/Dashboard';
import Home from './pages/home/Home';

import firebaseAuth from './config/firebaseConfig';
import Signup from './components/modals/sign-up/Signup';
import Login from './components/modals/login/Login';

import { AuthContext } from './context/authContext';
import { ModalContext } from './context/modalContext';
import UnverifiedEmail from './components/modals/unverified-email/UnverifiedEmail';
function App() {

  const { user } = useContext(AuthContext);

  const { modalState } = useContext(ModalContext);

  return (
    <div className="App">
      {modalState && ReactDOM.createPortal(modalState, document.getElementById('modal-root'))}
      {!modalState && user.user !== null && !user.user.emailVerified && ReactDOM.createPortal(<UnverifiedEmail />, document.getElementById('modal-root'))}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ !user.user ? <Home /> : <Dashboard /> } />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
