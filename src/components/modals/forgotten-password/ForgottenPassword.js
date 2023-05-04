// context
import { ModalContext } from '../../../context/modalContext';

// hooks
import { useState, useReducer, useEffect, useContext } from 'react';
import { useLogout } from '../../../hooks/useLogout';
import { useValidateUserInput } from '../../../hooks/useValidateUserInput';
import { useSendPasswordResetEmail } from '../../../hooks/authentication-hooks/useSendPasswordResetEmail';

// components
import ModalBackground from '../../UI/modal-background/ModalBackground';
import ModalCard from '../../UI/modal-card/ModalCard';
import MessageModal from '../message-modal/MessageModal';


const initialEmailInputState = {
    value: '',
    isValid: false,
}

const ForgottenPassword = () => {


    const { validateEmail, userInputErrorMessage } = useValidateUserInput();

    const { sendPasswordResetEmail, passwordResetEmailState } = useSendPasswordResetEmail();

    const emailInputReducer = (state, action) => {

        switch (action.type) {
    
            case 'CHANGE_EMAIL_VALUE':
                    return { ...state, value: action.payload, isValid: validateEmail(action.payload) };
    
            case 'CHECK_EMAIL_IS_VALID':
                return { ...state, isValid: validateEmail(state.password) };
    
            default: return { ...state };
        }
    }


    const [emailInputState, dispatchEmailInputState] = useReducer(emailInputReducer, initialEmailInputState);

    const [passwordResetErrorMessage, setPasswordResetErrorMessage] = useState(null);
    const [sendButtonClicked, setSendButtonClicked] = useState(false)

    const { setModalState } = useContext(ModalContext);

    const { logout } = useLogout();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!sendButtonClicked){
            setSendButtonClicked(true);
        }
        // const formChecker = formIsValid();
        if(emailInputState.isValid){
            try{
                await sendPasswordResetEmail(emailInputState.value);
                // />);
                // props.onSuccessfulCompletion();
            }
            catch(err){
                setPasswordResetErrorMessage(err.message);
            }
            
        }
    }

    // Set this is a useEffect because when loggin in when unverified the login modal would not close
    useEffect(() => {
        if(passwordResetEmailState.success){
            setModalState(<MessageModal message='Please check your email and continue from there.' />);
        }
    }, [passwordResetEmailState.success, setModalState])

    return (
        <>
            <ModalBackground />
            <ModalCard>

                <h3>Please enter your email.</h3>
                <form onSubmit={handleSubmit}>

                    <label>
                        <span>Email:</span>
                        <input 
                            type='email'
                            value={emailInputState.value}
                            onChange={(e) => dispatchEmailInputState({ 
                                type: 'CHANGE_EMAIL_VALUE', 
                                payload: e.target.value 
                            })} 
                        />
                    </label>
                    
                    {!passwordResetEmailState.isPending ? <button>Let's Go!</button> : <button disabled>Pending...</button>}
                </form>

                {passwordResetEmailState.error ? ( <p>{passwordResetEmailState.error}</p> ) : (<div></div>)}
                {sendButtonClicked && userInputErrorMessage && ( <p>{userInputErrorMessage}</p> )}

                <button onClick={logout}>Logout</button>

            </ModalCard>
    
        </>
    )
}

export default ForgottenPassword;