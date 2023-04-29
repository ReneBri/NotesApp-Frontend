import Login from "../login/Login";

import Signup from "../sign-up/Signup";

import { ModalContext } from "../../../context/modalContext";

import { useContext } from "react";

import firebaseAuth from "../../../config/firebaseConfig";

import ModalBackground from "../../UI/modal-background/ModalBackground";

import ModalCard from "../../UI/modal-card/ModalCard";

import { AuthContext } from "../../../context/authContext";

const UnverifiedEmail = props => {

    const { setModalState } = useContext(ModalContext);

    const { user } = useContext(AuthContext);

    const handleSendEmailVerification = async () => {
        await firebaseAuth.currentUser.sendEmailVerification();
        setModalState(<Login />);
    }

    if(user){
        return (
            <>
                <ModalBackground />
                <ModalCard>
    
                    <h3>The email associated with this account is unverified. Please verify it to continue to our website!</h3>
    
                    <button onClick={handleSendEmailVerification}>Resend Verification Email</button>
                    <button onClick={() => setModalState(<Login />)}>Back to Login</button>
    
                </ModalCard>
        
            </>
        )
    }else{
        return 
    }
    
}

export default UnverifiedEmail;