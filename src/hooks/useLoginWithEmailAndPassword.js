import { useEffect, useState, useReducer, useContext } from 'react'
import { AuthContext } from '../context/authContext';
import firebaseAuth from '../config/firebaseConfig';

const initialLoginState = {
    loginIsPending: null,
    loginError: null
}

const reduceLogin = (state, action) => {
    switch (action.type) {
        case 'ATTEMPT_LOGIN':
            return { loginIsPending: true, loginError: null };
        case 'LOGIN_COMPLETE':
            return { loginIsPending: false, loginError: null };
        case 'LOGIN_ERROR':
            return { loginIsPending: false, loginError: action.payload };
        default: return state;
    }
}

export const useLoginWithEmailAndPassword = () => {

    const [loginState, dispatchLogin] = useReducer(reduceLogin, initialLoginState);

    const [isCancelled, setIsCancelled] = useState(false);

    const { user, dispatchAuthState } = useContext(AuthContext);

    const login = async (email, password) => {
            console.log(1, user, loginState);
            dispatchLogin({ type: 'ATTEMPT_LOGIN' });
    
            try {
                const userCredentials = await firebaseAuth.signInWithEmailAndPassword(email, password);

                dispatchAuthState({ type: 'LOGIN', payload: userCredentials.user });
                console.log(2, user, loginState);
                if (!isCancelled) {
                    dispatchLogin({ type: 'LOGIN_COMPLETE' });
                }
            }
            catch (err) {
                if (!isCancelled){
                    dispatchLogin({ type: 'LOGIN_ERROR', payload: err.message });
                    console.log(3, user, loginState);
                }
            }
        
    }

    // cleanup function
    useEffect(() => {
        return () => {setIsCancelled(true)}
    }, [])

    return { login, loginState };
    
}