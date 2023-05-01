// styles

// config
import firebaseAuth from '../config/firebaseConfig';

// context
import { AuthContext } from '../context/authContext';

// hooks
import { useEffect, useState, useReducer, useContext } from 'react'

// components


const initialLogoutState = {
    logoutIsPending: null,
    logoutError: null
}

const reduceLogout = (state, action) => {
    switch (action.type) {
        case 'ATTEMPT_LOGOUT':
            return { logoutIsPending: true, logoutError: false };
        case 'LOGOUT_COMPLETE':
            return { logoutIsPending: false, logoutError: false };
        case 'LOGOUT_ERROR':
            return { logoutIsPending: false, logoutError: action.payload };
        default: return state;
    }
}

export const useLogout = () => {

    const [logoutState, dispatchLogout] = useReducer(reduceLogout, initialLogoutState);

    // Saftey measure for unmounting. setIsCancelled is used in the useEffect clean-up function below
    const [isCancelled, setIsCancelled] = useState(false);

    // This is so we can update the React state
    const { dispatchAuthState } = useContext(AuthContext);

    // Main exported function we use for logout
    const logout = async () => {

            dispatchLogout({ type: 'ATTEMPT_LOGOUT' });
    
            try {
                // Signout user from Firebase 
                await firebaseAuth.signOut();

                dispatchAuthState({ type: 'LOGOUT', payload: null });

                // Re-update state and authContext only if still mounted
                if (!isCancelled) {
                    dispatchLogout({ type: 'LOGOUT_COMPLETE' });
                }
            }
            catch (err) {
                // Re-update state and authContext only if still mounted
                if (!isCancelled){
                    dispatchLogout({ type: 'LOGOUT_COMPLETE', payload: err.message});
                }
            }
    }

    // Clean-up function for unmounting
    useEffect(() => {
        return () => {setIsCancelled(true)}
    }, [])

    // Return object
    return { logout, logoutState };
    
}