// styles

// config
import firebaseAuth from '../config/firebaseConfig';
import firebase from "firebase/app"; 
import "firebase/auth";

// context
import { AuthContext } from '../context/authContext';

// hooks
import { useEffect, useState, useReducer, useContext } from 'react'

// components


const initialReauthState = {
    reauthIsPending: null,
    reauthError: null
}

const reduceReauth = (state, action) => {
    switch (action.type) {
        case 'ATTEMPT_REAUTH':
            return { reauthIsPending: true, reauthError: null, reauthSuccess: null };
        case 'REAUTH_COMPLETE':
            return { reauthIsPending: false, reauthError: null, reauthSuccess: true };
        case 'REAUTH_ERROR':
            return { reauthIsPending: false, reauthError: action.payload, reauthSuccess: false };
        default: return state;
    }
}

export const useReauthenticateUser = () => {

    const [reauthState, dispatchReauth] = useReducer(reduceReauth, initialReauthState);

    // Saftey measure for unmounting. setIsCancelled is used in the useEffect clean-up function below
    const [isCancelled, setIsCancelled] = useState(false);

    // This is so we can update the React state
    const { user, dispatchAuthState } = useContext(AuthContext);

    // Main exported function we use for login
    const reauthenticateUser = async (password) => {

        const credential = firebase.auth.EmailAuthProvider.credential(user.user.email, 
            password);
        
        dispatchReauth({ type: 'ATTEMPT_REAUTH' });

        try {
            // Send reauthentication token from Firebase
            await firebaseAuth.currentUser.reauthenticateWithCredential(credential);

            // Re-update state and authContext only if still mounted
            if (!isCancelled) {
                dispatchReauth({ type: 'REAUTH_COMPLETE' });
            }
        }
        catch (err) {
            // Re-update state and authContext only if still mounted
            if (!isCancelled){
                dispatchReauth({ type: 'REAUTH_ERROR', payload: err.message });
            }
        }
    }

    // Clean-up function for unmounting
    useEffect(() => {
        return () => {setIsCancelled(true)}
    }, [])

    // Return object
    return { reauthenticateUser, reauthState };
    
}