// styles

// config

// context
import { ModalContext } from "../../../context/modalContext";

// hooks
import { useContext } from "react";

// components
import Login from "../login/Login";
import ModalBackground from "../../UI/modal-background/ModalBackground";
import ModalCard from "../../UI/modal-card/ModalCard";


const MessageModal = props => {

    const { setModalState } = useContext(ModalContext);


        return (
            <>
                <ModalBackground />
                <ModalCard>
    
                    <h3>{props.message}</h3>
    
                    <button onClick={() => setModalState(<Login />)}>Back to Login</button>
    
                </ModalCard>
        
            </>
        )
    
}

export default MessageModal;