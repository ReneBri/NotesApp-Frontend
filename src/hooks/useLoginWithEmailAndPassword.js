// styles

// config
import firebaseAuth from '../config/firebaseConfig';

// context
import { AuthContext } from '../context/authContext';

// hooks
import { useEffect, useState, useReducer, useContext } from 'react'

// components


const initialLoginState = {
    loginIsPending: null,
    loginError: null
}

const reduceLogin = (state, action) => {
    switch (action.type) {
        case 'ATTEMPT_LOGIN':
            return { loginIsPending: true, loginError: null, loginSuccess: null };
        case 'LOGIN_COMPLETE':
            return { loginIsPending: false, loginError: null, loginSuccess: true };
        case 'LOGIN_ERROR':
            return { loginIsPending: false, loginError: action.payload, loginSuccess: false };
        default: return state;
    }
}

export const useLoginWithEmailAndPassword = () => {

    const [loginState, dispatchLogin] = useReducer(reduceLogin, initialLoginState);

    const [isCancelled, setIsCancelled] = useState(false);

    const { user, dispatchAuthState } = useContext(AuthContext);

    const login = async (email, password) => {

            dispatchLogin({ type: 'ATTEMPT_LOGIN' });
    
            try {
                const userCredentials = await firebaseAuth.signInWithEmailAndPassword(email, password);

                if (!isCancelled) {
                    dispatchAuthState({ type: 'LOGIN', payload: userCredentials.user });
                    dispatchLogin({ type: 'LOGIN_COMPLETE' });
                }
            }
            catch (err) {
                if (!isCancelled){
                    dispatchLogin({ type: 'LOGIN_ERROR', payload: err.message });

                }
            }
        
    }

    // cleanup function
    useEffect(() => {
        return () => {setIsCancelled(true)}
    }, [])

    return { login, loginState };
    
}