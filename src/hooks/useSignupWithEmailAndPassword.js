// styles

// config
import firebaseAuth from '../config/firebaseConfig';

// context
import { AuthContext } from '../context/authContext';

// hooks
import { useReducer, useContext, useState, useEffect  } from 'react';

// components


const initialSignupState = {
    signupIsPending: null,
    signupError: null
}

const reduceSignupState = (state, action) => {
    switch (action.type) {
        case 'ATTEMPT_SIGNUP':
            return { signupIsPending: true, signupError: null, signupSuccess: null };
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

    // Saftey measure for unmounting. setIsCancelled is used in the useEffect clean-up function below
    const [isCancelled, setIsCancelled] = useState(false);

    // This is so we can update the React state
    const { dispatchAuthState } = useContext(AuthContext);

    // Main exported function we use for signup
    const signupWithEmailAndPassword = async (email, password, firstName) => {

        setIsCancelled(false);

        dispatchSignupState({type: 'ATTEMPT_SIGNUP'});
    
        try{
            // Create user in Firebase database
            const userCredential = await firebaseAuth.createUserWithEmailAndPassword(email, password);

            // Once created update the users profile displayName value
            await firebaseAuth.currentUser.updateProfile({
                displayName: firstName
            });
            // Send email verification where user MUST confirm their email address
            await firebaseAuth.currentUser.sendEmailVerification();
            
            // Create user object with relevant data which we can use to update our personal user documents
            // const userObject = {
            //     firstName,
            //     uid: userCredential.user.uid
            // }

            // Re-update state and authContext only if still mounted
            if(!isCancelled){
                dispatchAuthState({ type: 'SIGNUP', payload: userCredential.user });
                dispatchSignupState({type: 'SIGNUP_COMPLETE'});
            }
            
        }catch(err){
            // Re-update state only if still mounted
            if(!isCancelled){
                dispatchSignupState({type: 'SIGNUP_ERROR', payload: err.message});
            }
            
        }
        
    }
    // Clean-up function for unmounting
    useEffect(() => {
        return () => setIsCancelled(true);
    }, []);

    // Return object
    return { signupState, signupWithEmailAndPassword }
}