import { useEffect, useState, useReducer, useContext } from 'react'
import { AuthContext } from '../context/authContext';
import firebaseAuth from '../config/firebaseConfig';

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
            console.log(1, user, logoutState);
            dispatchLogout({ type: 'ATTEMPT_LOGOUT' });
    
            try {
                await firebaseAuth.signOut();

                dispatchAuthState({ type: 'LOGOUT', payload: null });
                console.log(2, user, logoutState);
                if (!isCancelled) {
                    dispatchLogout({ type: 'LOGOUT_COMPLETE' });
                }
            }
            catch (err) {
                if (!isCancelled){
                    dispatchLogout({ type: 'LOGOUT_COMPLETE', payload: err.message});
                    console.log(3, user, logoutState);
                }
            }
        
    }

    // cleanup function
    useEffect(() => {
        return () => {setIsCancelled(true)}
    }, [])

    return { logout, logoutState };
    
}