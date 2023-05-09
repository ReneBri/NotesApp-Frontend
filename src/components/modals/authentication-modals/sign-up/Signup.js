// styles

// context
import { ModalContext } from '../../../../context/modalContext';

// hooks
import { useEffect, useReducer, useState, useContext } from 'react';
import { useSignupWithEmailAndPassword } from '../../../../hooks/authentication-hooks/useSignupWithEmailAndPassword';
import { useLogout } from '../../../../hooks/authentication-hooks/useLogout';
import { useValidateUserInput } from '../../../../hooks/authentication-hooks/useValidateUserInput';

// components
import ModalCard from '../../modal-card/ModalCard';
import ModalBackground from '../../modal-background/ModalBackground';
import Login from '../login/Login';


const initialInputFormState = {
    displayName: '',
    displayNameIsValid: false,
    email: '',
    emailIsValid: false,
    passwordOne: '',
    passwordOneIsValid: false,
    passwordTwo: '',
    passwordTwoIsValid: false
}


const Signup = props => {

    // Import authentication validity checking functions from hook
    const { validateDisplayName, validateEmail, validatePasswordForSignup, validateMatchingPasswordForSignup } = useValidateUserInput();

    const inputFormReducer = (state, action) => {
        switch (action.type) {
            case 'CHANGE_DISPLAYNAME_VALUE':
                    return { ...state, displayName: action.payload, displayNameIsValid: validateDisplayName(action.payload) };
            case 'CHANGE_EMAIL_VALUE':
                    return { ...state, email: action.payload, emailIsValid: validateEmail(action.payload) };
            case 'CHANGE_PASSWORD_ONE_VALUE':
                    return { ...state, passwordOne: action.payload, passwordOneIsValid: validatePasswordForSignup(action.payload) };
            case 'CHANGE_PASSWORD_TWO_VALUE':
                    return { ...state, passwordTwo: action.payload, passwordTwoIsValid: validateMatchingPasswordForSignup(state.passwordOne, action.payload) };
            default: return { ...state };
        }
    }

    // State for user input
    const [inputFormState, dispatchInputFormState] = useReducer(inputFormReducer, initialInputFormState);

    // State to display input error message
    const [inputErrorMessage, setInputErrorMessage] = useState(null);

    // Only once the submit button is clicked React show the user input error message
    const [signupButtonClicked, setSignupButtonClicked] = useState(false);

    // Disables inputs after submit begins
    const [inputIsDisabled, setInputIsDisabled] = useState(false);

    // Signup hook
    const { signupState, signupWithEmailAndPassword } = useSignupWithEmailAndPassword();

    // Logout hook
    const { logout } = useLogout();

    // Modal context to set modal
    const { setModalState } = useContext(ModalContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!signupButtonClicked){
            setSignupButtonClicked(true);
        }
        // Only if form meets all validity checks will the submit to Firebase trigger
        const formChecker = formIsValid();
        if(formChecker){
            await signupWithEmailAndPassword(inputFormState.email, inputFormState.passwordOne, 'Rene');
            logout();
        }
    }

    // REPLACE WITH VALIDITY CHECKING HOOK!
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const formIsValid = () => {
            if(!inputFormState.displayNameIsValid){
                setInputErrorMessage('Name must only contain alphabetic characters and be between 1 & 15 letters long.');
                return false;
            }else if(!inputFormState.emailIsValid){
                setInputErrorMessage('Must be a valid email address.');
                return false;
            }else if(!inputFormState.passwordOneIsValid){
                setInputErrorMessage('Password must be 6 or more characters long.');
                return false;
            }else if(!inputFormState.passwordTwoIsValid){
                setInputErrorMessage('Passwords must match.');
                return false;
            }else{
                setInputErrorMessage(null);
                return true;
            }
    }

    // Checks form validity on every change made to user input
    useEffect(() => {
            formIsValid();
    }, [inputFormState, formIsValid])

    // Disables user inputs after button is clicked but allows users to alter the input fields should the signup fail
    useEffect(() => {
        if(signupState.success === true || signupState.isPending === true){
            setInputIsDisabled(true);
        }else{
            setInputIsDisabled(false);
        }
    }, [signupState.success, signupState.isPending])

    return (
        <>
            <ModalBackground />
            <ModalCard>
                <h3>Sign-up with Email & Password</h3>
                <form onSubmit={handleSubmit}>
                    
                    <label>
                        <span>*Display Name:</span>
                        <input 
                            type='text' 
                            disabled={inputIsDisabled}
                            value={inputFormState.displayName}
                            onChange={(e) => dispatchInputFormState({
                                type: 'CHANGE_DISPLAYNAME_VALUE',
                                payload: e.target.value
                            })}
                        />
                    </label>

                    <label>
                        <span>*Email:</span>
                        <input 
                            type='text'
                            disabled={inputIsDisabled}
                            value={inputFormState.email}
                            onChange={(e) => dispatchInputFormState({ 
                                    type: 'CHANGE_EMAIL_VALUE', 
                                    payload: e.target.value 
                            })}  
                        />
                    </label>

                    <label>
                        <span>*Password:</span>
                        <input 
                            type='password'
                            disabled={inputIsDisabled}
                            value={inputFormState.passwordOne}
                            onChange={(e) => dispatchInputFormState({ 
                                type: 'CHANGE_PASSWORD_ONE_VALUE', 
                                payload: e.target.value 
                            })} 
                        />
                    </label>

                    <label>
                        <span>*Confirm Password:</span>
                        <input 
                            type='password'
                            disabled={inputIsDisabled}
                            value={inputFormState.passwordTwo}
                            onChange={(e) => dispatchInputFormState({ 
                                type: 'CHANGE_PASSWORD_TWO_VALUE', 
                                payload: e.target.value 
                            })} 
                        />
                    </label>
                    
                    {!signupState.isPending ? <button>Create Account!</button> : <button disabled>Creating Account...</button>}
                </form>

                {signupState.error ? ( <p>{signupState.error}</p> ) : (<div></div>)}
                {signupButtonClicked && inputErrorMessage && ( <p>{inputErrorMessage}</p> )}

                {signupState.success && <button onClick={() => setModalState(<Login />)}>Go to Login</button>}

            </ModalCard>
        </>
    )
}

export default Signup;