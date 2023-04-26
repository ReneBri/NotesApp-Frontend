import React, { useReducer, useContext, useState, useEffect  } from 'react';
import firebaseAuth from '../config/firebaseConfig';
import { AuthContext } from '../context/authContext';

const initialSignupState = {
    signupIsPending: null,
    signupError: null
}

const reduceSignupState = (action, state) => {
    switch (action.type) {
        case 'ATTEMPT_SIGNUP':
            return { signupIsPending: true, signupError: null };
        case 'SIGNUP_COMPLETE':
            return { signupIsPending: false, signupError: null };
        case 'SIGNUP_ERROR':
            return { signupIsPending: false, signupError: action.payload };
        default: 
            return state;
    }
}

export const useSignupWithEmailAndPassword = () => {

    const [signupState, dispatchSignupState] = useReducer(reduceSignupState, initialSignupState);
    const [isCancelled, setIsCancelled] = useState(false);

    const { dispatchAuthState } = useContext(AuthContext);

    const signupWithEmailAndPassword = async (email, password, firstName) => {

        console.log(1);
        setIsCancelled(false);
        dispatchSignupState({type: 'ATTEMPT_SIGNUP'});
    
        try{
            console.log(2);
            const userCredential = await firebaseAuth.createUserWithEmailAndPassword(email, password);
            dispatchAuthState({ type: 'SIGNUP', payload: userCredential });
            const userObject = {
                firstName,
                uid: userCredential.user.uid
            }
            if(!isCancelled){
                dispatchSignupState({type: 'SIGNUP_COMPLETE'});
            }
            
        }catch(err){
            console.log(5);
            if(!isCancelled){
                console.log(err)
                dispatchSignupState({type: 'SIGNUP_ERROR', payload: err.message});
            }
            
        }
        
    }
    // useEffect(() => {
    //     return () => setIsCancelled(true);
    // }, []);

    return { signupState, signupWithEmailAndPassword }
}