// styles

// config
import firebaseAuth from "../../../config/firebaseConfig";

// context
import { ModalContext } from "../../../context/modalContext";
import { AuthContext } from "../../../context/authContext";

// hooks
import { useContext } from "react";

// components
import Login from "../login/Login";
import Signup from "../sign-up/Signup";
import ModalBackground from "../../UI/modal-background/ModalBackground";
import ModalCard from "../../UI/modal-card/ModalCard";


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