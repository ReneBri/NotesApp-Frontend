import ModalCard from '../UI/modal-card/ModalCard';
import ModalBackground from '../UI/modal-background/ModalBackground';
import { useEffect, useReducer, useState } from 'react';
import { useSignupWithEmailAndPassword } from '../../hooks/useSignupWithEmailAndPassword';


let signupButtonClicked = false;

const initialInputFormState = {
    firstName: '',
    firstNameIsValid: null,
    email: '',
    emailIsValid: null,
    PasswordOne: '',
    passwordOneIsValid: null,
    passwordTwo: '',
    passwordTwoIsValid: null
}

const handleValidateFirstName = (firstName) => {
    if (firstName.trim().match(/^[A-Za-z]+$/) && firstName.trim().length > 4){
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

// still need to create a password check and validation!
const inputFormReducer = (state, action) => {
    switch (action.type) {

        case ('CHANGE_FIRSTNAME_VALUE'):
            console.log(action.payload);
            if(signupButtonClicked){
                return { ...state, firstName: action.payload, firstNameIsValid: handleValidateFirstName(action.payload) };
            }
            console.log(action.payload);
            return {...state, firstName: action.payload};

        case 'CHANGE_EMAIL_VALUE':
            console.log(action.payload);
            if(signupButtonClicked){
                return { ...state, email: action.payload, emailIsValid: handleValidateEmail(action.payload) };
            }
            return {...state, email: action.payload};

        case 'CHANGE_PASSWORD_ONE_VALUE':
            console.log(action.payload);
            if(signupButtonClicked){
                return { ...state, passwordOne: action.payload };
            }
            return {...state, passwordOne: action.payload};

        case 'CHANGE_PASSWORD_TWO_VALUE':
            console.log(action.payload);
            if(signupButtonClicked){
                return { ...state, passwordTwo: action.payload };
            }
            return { ...state, passwordTwo: action.payload };

        default: return { ...state };
    }
}

const Signup = props => {

    const [inputFormState, dispatchInputFormState] = useReducer(inputFormReducer, initialInputFormState);

    const [inputErrorMessage, setInputErrorMessage] = useState(null);

    const { signupState, signupWithEmailAndPassword } = useSignupWithEmailAndPassword();

    const handleSubmit = (e) => {
        e.preventDefault();
        signupButtonClicked = true;
        validateForm();
        // signupWithEmailAndPassword('rene@rendawg.com', '123asdasd4', 'Rene');
        console.log('ive been clicked');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const validateForm = () => {
        if(signupButtonClicked){
            if(!inputFormState.firstNameIsValid){
                setInputErrorMessage('Name must only contain alphabetic characters and be 5 or more letters.');
                return
            }else if(!inputFormState.emailIsValid){
                setInputErrorMessage('Must be a valid email address.');
                return;
            }else{
                setInputErrorMessage(null);
            }
        }
    }

    useEffect(() => {
        validateForm()
    }, [inputFormState])

    return (
        <ModalBackground>
            <ModalCard>
                <h3>Sign-up with Email & Password</h3>
                <form onSubmit={handleSubmit}>
                    
                    <label>
                        <span>*First Name:</span>
                        <input 
                            type='text' 
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
                            value={inputFormState.passwordTwo}
                            onChange={(e) => dispatchInputFormState({ 
                                type: 'CHANGE_PASSWORD_TWO_VALUE', 
                                payload: e.target.value 
                            })} 
                        />
                    </label>
                    
                    <button>Create Account!</button>
                </form>

                {inputErrorMessage && ( <p>{inputErrorMessage}</p> )}

            </ModalCard>
        </ModalBackground>
    )
}

export default Signup;