// context
import { ModalContext } from '../../../context/modalContext';

// hooks
import { useState, useReducer, useEffect, useContext } from 'react';
import { useLogout } from '../../../hooks/useLogout';
import { useValidateUserInput } from '../../../hooks/useValidateUserInput';
import { useReauthenticateUser } from '../../../hooks/useReauthenticateUser';

// components
import ModalBackground from '../../UI/modal-background/ModalBackground';
import ModalCard from '../../UI/modal-card/ModalCard';


const initialInputFormState = {
    email: '',
    emailIsValid: false,
    password: '',
    passwordIsValid: false
}


const ReauthenticateUser = props => {

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

    const { logout } = useLogout();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!reauthButtonClicked){
            setReauthButtonClicked(true);
        }
        // const formChecker = formIsValid();
        if(inputFormState.passwordIsValid){
            // Theres no catch block here because the error message is already caught in the reauthState
            // Maybe we can just delete the catch here altogether?
            try{
                await reauthenticateUser(inputFormState.password);
                props.onSuccessfulCompletion();
            }
            catch(err){
                setReauthErrorMessage(err.message);
            }
            
        }
    }

    // Set this is a useEffect because when loggin in when unverified the login modal would not close
    useEffect(() => {
        if(reauthState.reauthSuccess){
            setModalState(null);
        }
    }, [reauthState.reauthSuccess, setModalState])

    return (
        <>
            <ModalBackground />
            <ModalCard>

                <h3>{props.message1}</h3>
                <h3>{props.message2}</h3>
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
                    
                    {!reauthState.reauthIsPending ? <button>Let's Go!</button> : <button disabled>Pending...</button>}
                </form>

                {reauthState.reauthError ? ( <p>{reauthState.reauthError}</p> ) : (<div></div>)}
                {reauthButtonClicked && userInputErrorMessage && ( <p>{userInputErrorMessage}</p> )}

                <button onClick={logout}>Logout</button>

            </ModalCard>
    
        </>
    )
}


export default ReauthenticateUser;