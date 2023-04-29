import { useReducer, useContext, useState, useEffect  } from 'react';
import firebaseAuth from '../config/firebaseConfig';
import { AuthContext } from '../context/authContext';

const initialSignupState = {
    signupIsPending: null,
    signupError: null
}

const reduceSignupState = (state, action) => {
    switch (action.type) {
        case 'ATTEMPT_SIGNUP':
            return { signupIsPending: true, signupError: null };
        case 'SIGNUP_COMPLETE':
            return { signupIsPending: true, signupError: 'We have sent you an email. Please go to it to verify your email address.', signupSuccess: true };
        case 'SIGNUP_ERROR':
            return { signupIsPending: false, signupError: action.payload, signupSuccess: false };
        default: 
            return state;
    }
}

export const useSignupWithEmailAndPassword = () => {

    const [signupState, dispatchSignupState] = useReducer(reduceSignupState, initialSignupState);
    const [isCancelled, setIsCancelled] = useState(false);

    const { dispatchAuthState } = useContext(AuthContext);

    const signupWithEmailAndPassword = async (email, password, firstName) => {

        setIsCancelled(false);
        dispatchSignupState({type: 'ATTEMPT_SIGNUP'});
    
        try{
            const userCredential = await firebaseAuth.createUserWithEmailAndPassword(email, password);
            await firebaseAuth.currentUser.updateProfile({
                displayName: firstName
            });
            await firebaseAuth.currentUser.sendEmailVerification();
            
            // const userObject = {
            //     firstName,
            //     uid: userCredential.user.uid
            // }

            if(!isCancelled){
                dispatchAuthState({ type: 'SIGNUP', payload: userCredential.user });
                dispatchSignupState({type: 'SIGNUP_COMPLETE'});
            }
            
        }catch(err){
            if(!isCancelled){
                dispatchSignupState({type: 'SIGNUP_ERROR', payload: err.message});
            }
            
        }
        
    }
    useEffect(() => {
        return () => setIsCancelled(true);
    }, []);

    return { signupState, signupWithEmailAndPassword }
}