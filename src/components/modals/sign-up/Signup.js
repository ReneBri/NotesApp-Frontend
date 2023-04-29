import ModalCard from '../../UI/modal-card/ModalCard';
import ModalBackground from '../../UI/modal-background/ModalBackground';
import { useEffect, useReducer, useState, useContext } from 'react';
import { useSignupWithEmailAndPassword } from '../../../hooks/useSignupWithEmailAndPassword';
import { useLogout } from '../../../hooks/useLogout';
import { ModalContext } from '../../../context/modalContext';
import Login from '../login/Login';


const initialInputFormState = {
    firstName: '',
    firstNameIsValid: false,
    email: '',
    emailIsValid: false,
    passwordOne: '',
    passwordOneIsValid: false,
    passwordTwo: '',
    passwordTwoIsValid: false
}

// can these go inside of a hook to export??
const handleValidateFirstName = (firstName) => {
    if (firstName.trim().match(/^[A-Za-z]+$/) && firstName.trim().length > 0){
        return true;
    }else{
        return false;
    }
}

const handleValidateEmail = (email) => {
    if (email.trim().match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)){
        return true;
    }else{
        return false;
    }
}

const handleValidatePasswordOne = (password) => {
    if (password.length > 5){
        return true;
    }else{
        return false;
    }
}

const handleValidatePasswordTwo = (passwordOne, passwordTwo) => {
    if (passwordOne.length === 0 || passwordTwo.length === 0){
        return false;
    }
    if (passwordOne === passwordTwo){
        return true;
    }else{
        return false;
    }
}


const inputFormReducer = (state, action) => {

    switch (action.type) {

        case ('CHANGE_FIRSTNAME_VALUE'):
                return { ...state, firstName: action.payload, firstNameIsValid: handleValidateFirstName(action.payload) };
  

        case 'CHANGE_EMAIL_VALUE':
                return { ...state, email: action.payload, emailIsValid: handleValidateEmail(action.payload) };

        case 'CHANGE_PASSWORD_ONE_VALUE':
                return { ...state, passwordOne: action.payload, passwordOneIsValid: handleValidatePasswordOne(action.payload) };

        case 'CHANGE_PASSWORD_TWO_VALUE':
                return { ...state, passwordTwo: action.payload, passwordTwoIsValid: handleValidatePasswordTwo(state.passwordOne, action.payload) };

        default: return { ...state };
    }
}

const Signup = props => {

    const [inputFormState, dispatchInputFormState] = useReducer(inputFormReducer, initialInputFormState);

    const [inputErrorMessage, setInputErrorMessage] = useState(null);
    const [signupButtonClicked, setSignupButtonClicked] = useState(false);
    const [inputsDisabled, setInputsDisabled] = useState(false);

    const { signupState, signupWithEmailAndPassword } = useSignupWithEmailAndPassword();

    const { logout } = useLogout();

    const { setModalState } = useContext(ModalContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!signupButtonClicked){
            setSignupButtonClicked(true);
        }
        const formChecker = formIsValid();
        if(formChecker){
            await signupWithEmailAndPassword(inputFormState.email, inputFormState.passwordOne, 'Rene');
            logout();
        }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const formIsValid = () => {
            if(!inputFormState.firstNameIsValid){
                setInputErrorMessage('Name must only contain alphabetic characters and be at least 1 letter long.');
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

    useEffect(() => {
            formIsValid();
    }, [inputFormState, formIsValid])

    useEffect(() => {
        if(signupState.signupSuccess === true || signupState.signupIsPending === true){
            setInputsDisabled(true);
        }else{
            setInputsDisabled(false);
        }
    }, [signupState.signupSuccess, signupState.signupIsPending])

    return (
        <>
            <ModalBackground />
            <ModalCard>
                <h3>Sign-up with Email & Password</h3>
                <form onSubmit={handleSubmit}>
                    
                    <label>
                        <span>*First Name:</span>
                        <input 
                            type='text' 
                            disabled={inputsDisabled}
                            value={inputFormState.firstName}
                            onChange={(e) => dispatchInputFormState({
                                type: 'CHANGE_FIRSTNAME_VALUE',
                                payload: e.target.value
                            })}
                        />
                    </label>

                    <label>
                        <span>*Email:</span>
                        <input 
                            type='text'
                            disabled={inputsDisabled}
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
                            disabled={inputsDisabled}
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
                            disabled={inputsDisabled}
                            value={inputFormState.passwordTwo}
                            onChange={(e) => dispatchInputFormState({ 
                                type: 'CHANGE_PASSWORD_TWO_VALUE', 
                                payload: e.target.value 
                            })} 
                        />
                    </label>
                    
                    {!signupState.signupIsPending ? <button>Create Account!</button> : <button disabled>Creating Account...</button>}
                </form>

                {signupState.signupError ? ( <p>{signupState.signupError}</p> ) : (<div></div>)}
                {signupButtonClicked && inputErrorMessage && ( <p>{inputErrorMessage}</p> )}

                {signupState.signupSuccess && <button onClick={() => setModalState(<Login />)}>Go to Login</button>}

            </ModalCard>
        </>
    )
}

export default Signup;