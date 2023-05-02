// styles
import './App.css';

// routes & other
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ReactDOM from 'react-dom';

// config

// context
import { AuthContext } from './context/authContext';
import { ModalContext } from './context/modalContext';

// hooks
import { useContext } from 'react';

// components & pages
import Dashboard from './pages/dashboard/Dashboard';
import Home from './pages/home/Home';
import UnverifiedEmail from './components/modals/unverified-email/UnverifiedEmail';
import Navbar from './components/UI/navbar/Navbar';


function App() {

  const { user } = useContext(AuthContext);

  const { modalState } = useContext(ModalContext);

  return (
    <div className="App">

      {/* This is for the signup/login modals */}
      {modalState && ReactDOM.createPortal(modalState, document.getElementById('modal-root'))}

      {/* This is the UnverifiedEmail modal which blocks users from accessing the site unless their email is verified */}
      {!modalState && user.user !== null && !user.user.emailVerified && ReactDOM.createPortal(<UnverifiedEmail />, document.getElementById('modal-root'))}

      <BrowserRouter>
      <Navbar />
        <Routes>
          <Route path="/" element={ !user.user ? <Home /> : <Dashboard /> } />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
