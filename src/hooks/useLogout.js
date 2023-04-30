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

    const [isCancelled, setIsCancelled] = useState(false);

    const { user, dispatchAuthState } = useContext(AuthContext);

    const logout = async () => {
            dispatchLogout({ type: 'ATTEMPT_LOGOUT' });
    
            try {
                await firebaseAuth.signOut();

                dispatchAuthState({ type: 'LOGOUT', payload: null });

                if (!isCancelled) {
                    dispatchLogout({ type: 'LOGOUT_COMPLETE' });
                }
            }
            catch (err) {
                if (!isCancelled){
                    dispatchLogout({ type: 'LOGOUT_COMPLETE', payload: err.message});

                }
            }
        
    }

    // cleanup function
    useEffect(() => {
        return () => {setIsCancelled(true)}
    }, [])

    return { logout, logoutState };
    
}