import { ModalContext } from "../../context/modalContext";
import { useContext, useEffect, useState } from "react";

import Login from "../../components/modals/login/Login";
import Signup from "../../components/modals/sign-up/Signup";

const Home = props => {

    const { setModalState } = useContext(ModalContext);

    return (
        <div>
            Homepage without user signed in.
            <button onClick={() => setModalState(<Signup />)}>Signup</button>
            <button onClick={() => setModalState(<Login />)}>Login</button>
        </div>
    )
}

export default Home;