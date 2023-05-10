
import { useContext, useReducer, useState, useEffect, useCallback } from "react";
import { useValidateUserInput } from "../../../../hooks/authentication-hooks/useValidateUserInput";
import { useDeleteUser } from '../../../../hooks/authentication-hooks/useDeleteUser';


import { ModalContext } from "../../../../context/modalContext";

import MessageModal from "../message-modal/MessageModal";


const initialEmailState = {
    value: '',
    isValid: null
}

const ReauthWithoutPassword = ({ message1, message2, buttonText, onSuccessfulCompletion, successModalMessage, email }) => {

    const { validateEmail, userInputErrorMessage } = useValidateUserInput();

    const { deleteUser, deleteUserState } = useDeleteUser();

    const [matchingEmailError, setMatchingEmailError] = useState(null);

    const reduceEmailState = (state, action) => {
        switch (action.type){
            case 'CHANGE_EMAIL_VALUE':
                return { value: action.payload, isValid: validateEmail(action.payload) };
            case 'CHECKK_EMAIL_IS_VALID':
                return { ...state, isValid: validateEmail(state.value) };
            default:
                return state;
        }
    }

    const { setModalState } = useContext(ModalContext);

    const [reauthButtonClicked, setReauthButtonClicked] = useState(false);

    const [emailState, dispatchEmailState] = useReducer(reduceEmailState, initialEmailState);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Switches the reauthIsClicked state to show any user input errors
        setMatchingEmailError(null);
        if (!reauthButtonClicked){
            setReauthButtonClicked(true);
        }
        // Checks is the emailState is valid and if so checks if the emails match
        if(emailState.isValid){
            const emailsMatch = checkEmailsMatch();
            if(emailsMatch){
                await onSuccessfulCompletion();
                setModalState(<MessageModal message={successModalMessage} />);
            } else {
                setMatchingEmailError('Typed email does not match your saved email address.');
            }
        }
    }

    // Look into useCallback
    const checkEmailsMatch = useCallback(() => {
        if(!deleteUserState.success){
            if(emailState.value.toLowerCase() === email){
                return true;
            }
            return false;
        }
    }, [deleteUserState.success, email, emailState.value])

    // Once reauth button is clicked this will make sure the error message only displays when the emails are not matching
    useEffect(() => {
        const checkEmail = checkEmailsMatch();
        if(!checkEmail){
            setMatchingEmailError('Typed email does not match your saved email address.');
        } else {
            setMatchingEmailError(null);
        }
    }, [checkEmailsMatch, emailState.value])


    return(
        <>
            <h3>{message1}</h3>
            <h4>{message2}</h4>
            <p>{`You are signed in as ${email}`}</p>

            <form onSubmit={handleSubmit}>

                <label>
                    <span>Email:</span>
                    <input 
                        type='text'
                        value={emailState.value}
                        onChange={(e) => dispatchEmailState({ 
                            type: 'CHANGE_EMAIL_VALUE', 
                            payload: e.target.value 
                        })} 
                        autoFocus
                    />
                </label>

                {!deleteUserState.isPending ? <button>{buttonText}</button> : <button disabled>Pending...</button>}
            </form>

            {deleteUserState.error ? ( <p>{deleteUserState.error}</p> ) : (<div></div>)}
            {reauthButtonClicked && userInputErrorMessage && ( <p>{userInputErrorMessage}</p> )}
            {matchingEmailError && !userInputErrorMessage && reauthButtonClicked && (<p>{matchingEmailError}</p>)}
        </>
    )
}

export default ReauthWithoutPassword;