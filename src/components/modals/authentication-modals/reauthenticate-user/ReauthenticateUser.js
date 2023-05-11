// context
import { ModalContext } from '../../../../context/modalContext';
import { AuthContext } from '../../../../context/authContext';

// hooks
import { useState, useReducer, useEffect, useContext } from 'react';
import { useValidateUserInput } from '../../../../hooks/authentication-hooks/useValidateUserInput';
import { useReauthenticateUser } from '../../../../hooks/authentication-hooks/useReauthenticateUser';

// components
import ModalBackground from '../../modal-background/ModalBackground';
import ModalCard from '../../modal-card/ModalCard';
import MessageModal from '../message-modal/MessageModal';
import ReauthWithoutPassword from './ReauthWithoutPassword';


const initialPasswordState = {
    value: '',
    isValid: false
}


const ReauthenticateUser = ({ message1, message2, buttonText, onSuccessfulCompletion, deleteUserState, successModalMessage, email }) => {

    const { validatePassword, userInputErrorMessage } = useValidateUserInput();

    const passwordReducer = (state, action) => {
        switch (action.type) {
            case 'CHANGE_PASSWORD_VALUE':
                    return { ...state, value: action.payload, isValid: validatePassword(action.payload) };
            case 'CHECK_PASSWORD_IS_VALID':
                return { ...state, isValid: validatePassword(state.value) };
            default: return { ...state };
        }
    }

    const { reauthenticateUser, reauthState } = useReauthenticateUser();

    const [passwordState, dispatchPasswordState] = useReducer(passwordReducer, initialPasswordState);

    const [reauthButtonClicked, setReauthButtonClicked] = useState(false);

    const { setModalState } = useContext(ModalContext);

    const { user } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!reauthButtonClicked){
            setReauthButtonClicked(true);
        }
        if(passwordState.isValid){
            await reauthenticateUser(passwordState.value);
        }
    }

    // Set this is a useEffect because when loggin in when unverified the login modal would not close
    useEffect(() => {
        if(reauthState.success){
            onSuccessfulCompletion();
            setModalState(<MessageModal 
                message={successModalMessage}
                includeLoginButton={true} 
            />);
        }
    }, [successModalMessage, reauthState.success, setModalState, onSuccessfulCompletion])

    return (
        <>
            <ModalBackground />
            <ModalCard>

                {user.hasPassword && (
                    <>
                        <h3>{message1}</h3>
                        <h4>{message2}</h4>

                        <form onSubmit={handleSubmit}>

                        <label>
                            <span>Password:</span>
                            <input 
                                type='password'
                                value={passwordState.value}
                                onChange={(e) => dispatchPasswordState({ 
                                    type: 'CHANGE_PASSWORD_VALUE', 
                                    payload: e.target.value 
                                })} 
                                autoFocus
                                disabled={reauthState.isPending}
                            />
                        </label>

                        {!reauthState.isPending ? (<button>{buttonText}</button>) : (<button disabled>Pending...</button>)}

                        </form>

                        {reauthState.error ? (<p>{reauthState.error}</p>) : (<div></div>)}

                        {reauthButtonClicked && userInputErrorMessage && ( <p>{userInputErrorMessage}</p> )}
                    </>
                )}

                {!user.hasPassword && (<ReauthWithoutPassword 
                    message1={message1} 
                    message2={message2} 
                    buttonText={buttonText} 
                    onSuccessfulCompletion={onSuccessfulCompletion} 
                    deleteUserState={deleteUserState}
                    successModalMessage={successModalMessage} 
                    email={email} 
                />)}

            </ModalCard>
    
        </>
    )
}


export default ReauthenticateUser;