// context
import { ModalContext } from '../../../../context/modalContext';

// hooks
import { useState, useReducer, useEffect, useContext } from 'react';
import { useLogout } from '../../../../hooks/authentication-hooks/useLogout';
import { useValidateUserInput } from '../../../../hooks/authentication-hooks/useValidateUserInput';
import { useSendPasswordResetEmail } from '../../../../hooks/authentication-hooks/useSendPasswordResetEmail';

// components
import ModalBackground from '../../modal-background/ModalBackground';
import ModalCard from '../../modal-card/ModalCard';
import MessageModal from '../message-modal/MessageModal';


const initialEmailInputState = {
    value: '',
    isValid: false,
}

const ForgottenPassword = () => {

    const { validateEmail, userInputErrorMessage } = useValidateUserInput();

    const { sendPasswordResetEmail, passwordResetEmailState } = useSendPasswordResetEmail();

    // Must be done within component as lower order function is obtained from the useValidateUserInput hook
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

    // Mostly not neccessary. Can probably delete
    const [passwordResetErrorMessage, setPasswordResetErrorMessage] = useState(null);

    // This is so that the userInputErrorMessage only shows to the client after the send button is clicked
    const [sendButtonClicked, setSendButtonClicked] = useState(false)

    // To change the modal state
    const { setModalState } = useContext(ModalContext);

    const { logout } = useLogout();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!sendButtonClicked){
            setSendButtonClicked(true);
        }
        if(emailInputState.isValid){
            // We perhaps do not need a try catch since there is error message on the emailInputState
            // No try/catch as error handling is done within the useSendPasswordResetEmail hook
            try{
                await sendPasswordResetEmail(emailInputState.value);
                // />);
                // props.onSuccessfulCompletion();
            }
            catch(err){
                // pretty sure this throws the same error as passwordResetEmailState.error
                setPasswordResetErrorMessage(err.message);
            }
            
        }
    }

    // Redirect to a new modal upon successful from submission completion
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
                            autoFocus
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