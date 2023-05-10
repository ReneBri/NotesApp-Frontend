// context
import { ModalContext } from '../../../../context/modalContext';
import { AuthContext } from '../../../../context/authContext';

// hooks
import { useState, useReducer, useEffect, useContext } from 'react';
import { useLogout } from '../../../../hooks/authentication-hooks/useLogout';
import { useValidateUserInput } from '../../../../hooks/authentication-hooks/useValidateUserInput';
import { useReauthenticateUser } from '../../../../hooks/authentication-hooks/useReauthenticateUser';

// components
import ModalBackground from '../../modal-background/ModalBackground';
import ModalCard from '../../modal-card/ModalCard';
import MessageModal from '../message-modal/MessageModal';
import ReauthWithoutPassword from './ReauthWithoutPassword';


const initialInputFormState = {
    email: '',
    emailIsValid: false,
    password: '',
    passwordIsValid: false
}


const ReauthenticateUser = ({ message1, message2, buttonText, onSuccessfulCompletion, successModalMessage, email }) => {

    const { validatePassword, userInputErrorMessage } = useValidateUserInput();

    const inputFormReducer = (state, action) => {
        switch (action.type) {
            case 'CHANGE_PASSWORD_VALUE':
                    return { ...state, password: action.payload, passwordIsValid: validatePassword(action.payload) };
            case 'CHECK_PASSWORD_IS_VALID':
                return { ...state, passwordIsValid: validatePassword(state.password) };
            default: return { ...state };
        }
    }

    const { reauthenticateUser, reauthState } = useReauthenticateUser();

    const [inputFormState, dispatchInputFormState] = useReducer(inputFormReducer, initialInputFormState);

    const [reauthErrorMessage, setReauthErrorMessage] = useState(null);

    const [reauthButtonClicked, setReauthButtonClicked] = useState(false);

    const { setModalState } = useContext(ModalContext);

    const { user } = useContext(AuthContext);

    const { logout } = useLogout();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!reauthButtonClicked){
            setReauthButtonClicked(true);
        }
        // const formChecker = formIsValid();
        if(inputFormState.passwordIsValid){
            await reauthenticateUser(inputFormState.password);
        }
    }

    // Set this is a useEffect because when loggin in when unverified the login modal would not close
    useEffect(() => {
        if(reauthState.reauthSuccess){
            onSuccessfulCompletion();
            setModalState(<MessageModal message={successModalMessage} />);
        }
    }, [successModalMessage, reauthState.reauthSuccess, setModalState, onSuccessfulCompletion])

    return (
        <>
            <ModalBackground />
            <ModalCard>

                {user.hasPassword && (<>
                    <h3>{message1}</h3>
                    <h4>{message2}</h4>

                    <form onSubmit={handleSubmit}>

                    <label>
                        <span>Password:</span>
                        <input 
                            type='password'
                            value={inputFormState.password}
                            onChange={(e) => dispatchInputFormState({ 
                                type: 'CHANGE_PASSWORD_VALUE', 
                                payload: e.target.value 
                            })} 
                            autoFocus
                        />
                    </label>

                    {!reauthState.reauthIsPending ? <button>{buttonText}</button> : <button disabled>Pending...</button>}
                    </form>

                    {reauthState.reauthError ? ( <p>{reauthState.reauthError}</p> ) : (<div></div>)}
                    {reauthButtonClicked && userInputErrorMessage && ( <p>{userInputErrorMessage}</p> )}
                </>)}

                {!user.hasPassword && (<ReauthWithoutPassword message1={message1} message2={message2} buttonText={buttonText} onSuccessfulCompletion={onSuccessfulCompletion} successModalMessage={successModalMessage} email={email} />)}

            </ModalCard>
    
        </>
    )
}


export default ReauthenticateUser;