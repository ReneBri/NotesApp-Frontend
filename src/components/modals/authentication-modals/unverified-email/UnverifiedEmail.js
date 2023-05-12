// styles

// config
import firebaseAuth from "../../../../config/firebaseConfig";

// context
import { ModalContext } from "../../../../context/modalContext";
import { AuthContext } from "../../../../context/authContext";

// hooks
import { useContext } from "react";

// components
import Login from "../login/Login";
import ModalBackground from "../../modal-background/ModalBackground";
import ModalCard from "../../modal-card/ModalCard";


const UnverifiedEmail = () => {

    const { setModalState } = useContext(ModalContext);

    const { user } = useContext(AuthContext);

    const handleSendEmailVerification = async () => {
        await firebaseAuth.currentUser.sendEmailVerification();
        setModalState(<Login />);
    }

    // UNSURE IF THIS IF STATEMENT IS NECCESSARY |||||||| CHECK IN FUTURE
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