// context
import { ModalContext } from '../../../../context/modalContext';

// config

// hooks
import { useState, useReducer, useEffect, useContext } from 'react';
import { useLoginWithEmailAndPassword } from '../../../../hooks/authentication-hooks/useLoginWithEmailAndPassword';

// components
import ModalBackground from '../../../modals/modal-background/ModalBackground';
import ModalCard from '../../../modals/modal-card/ModalCard';
import ForgottenPassword from '../forgotten-password/ForgottenPassword';
import GoogleAuthenticationButton from '../google-authentication-button/GoogleAuthenticationButton';
import ModalCardDivider from '../../modal-card/ModalCardDivider';


const initialInputFormState = {
    email: '',
    emailIsValid: false,
    password: '',
    passwordIsValid: false
}

const inputFormReducer = (state, action) => {
    switch (action.type) {
        case 'CHANGE_EMAIL_VALUE':
                return { ...state, email: action.payload, emailIsValid: handleValidateEmail(action.payload) };
        case 'CHANGE_PASSWORD_VALUE':
                return { ...state, password: action.payload, passwordIsValid: handleValidatePassword(action.payload) };
        case 'CHECK_EMAIL_IS_VALID':
            return { ...state, emailIsValid: handleValidateEmail(state.email) };
        case 'CHECK_PASSWORD_IS_VALID':
            return { ...state, passwordIsValid: handleValidatePassword(state.password) };
        default: return { ...state };
    }
}

const handleValidateEmail = (email) => {
    if (email.trim().match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)){
        return true;
    }else{
        return false;
    }
}

const handleValidatePassword = (password) => {
    if (password.length !== 0){
        return true;
    }else{
        return false;
    }
}

const Login = props => {

    const [inputFormState, dispatchInputFormState] = useReducer(inputFormReducer, initialInputFormState);

    const [inputErrorMessage, setInputErrorMessage] = useState(null);

    const [loginButtonClicked, setLoginButtonClicked] = useState(false)

    const { setModalState } = useContext(ModalContext);

    const { login, loginState } = useLoginWithEmailAndPassword();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!loginButtonClicked){
            setLoginButtonClicked(true);
        }
        const formChecker = formIsValid();
        if(formChecker){
            await login(inputFormState.email, inputFormState.password);
        }
    }

    // Set this is a useEffect because when loggin in when unverified the login modal would not close
    useEffect(() => {
        if(loginState.success){
            setModalState(null);
        }
    }, [loginState.success, setModalState])


    // eslint-disable-next-line react-hooks/exhaustive-deps
    const formIsValid = () => {
            if(!inputFormState.emailIsValid){
                setInputErrorMessage('Email address is invalid.');
                return false;
            } else if(!inputFormState.passwordIsValid){
                setInputErrorMessage('Please enter a password.');
                return false;
            }else{
                setInputErrorMessage(null);
                return true;
            }
    }

    useEffect(() => {
            formIsValid();
    }, [inputFormState, formIsValid])

    return (
        <>
            <ModalBackground />
            <ModalCard>

                <h3>Login with Email & Password</h3>
                <form onSubmit={handleSubmit}>

                    <label>
                        <span>Email:</span>
                        <input 
                            type='text'
                            value={inputFormState.email}
                            onChange={(e) => dispatchInputFormState({ 
                                type: 'CHANGE_EMAIL_VALUE', 
                                payload: e.target.value 
                            })}  
                            autoFocus
                        />
                    </label>

                    <label>
                        <span>Password:</span>
                        <input 
                            type='password'
                            value={inputFormState.passwordOne}
                            onChange={(e) => dispatchInputFormState({ 
                                type: 'CHANGE_PASSWORD_VALUE', 
                                payload: e.target.value 
                            })} 
                        />
                    </label>
                    
                    {!loginState.isPending ? <button>Login!</button> : <button disabled>Logging in...</button>}

                </form>

                {loginState.error ? ( <p>{loginState.error}</p> ) : (<div></div>)}

                {loginButtonClicked && inputErrorMessage && ( <p>{inputErrorMessage}</p> )}

                <ModalCardDivider />

                <GoogleAuthenticationButton />

                <button onClick={() => setModalState(<ForgottenPassword />)}>Forgotten your password?</button>

            </ModalCard>
    
        </>
    )
}

export default Login;