import { ModalContext } from "../../context/modalContext";
import { useContext, useEffect, useState } from "react";
import ReactDOM from 'react-dom';
import Login from "../../components/modals/login/Login";
import Signup from "../../components/modals/sign-up/Signup";

const Home = props => {

    const { modalState, setModalState } = useContext(ModalContext);

    return (
        <div>
            Homepage without user signed in.
            <button onClick={() => setModalState(<Signup />)}>Signup</button>
            <button onClick={() => setModalState(<Login />)}>Login</button>
            {modalState && ReactDOM.createPortal(modalState, document.getElementById('modal-root'))}, 
        </div>
    )
}

export default Home;