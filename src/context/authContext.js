import React, { useEffect, useReducer } from 'react';
import firebaseAuth from '../config/firebaseConfig';

export const AuthContext = React.createContext();

const authStateReducer = (state, action) => {
    switch (action.type) {
        case 'AUTH_STATE_IS_READY':
            return { user: action.payload, authIsReady: true };
        case 'SIGNUP':
            return { ...state, user: action.payload };
        case 'LOGOUT':
            return { ...state, user: null }
        case 'LOGIN':
            return { ...state, user: action.payload };
        default: return { ...state };
    }
}

export const AuthContextProvider = props => {

    const [authState, dispatchAuthState] = useReducer(authStateReducer, { user: null, authIsReady: false })

    useEffect(() => {
        firebaseAuth.onAuthStateChanged((user) => {
            if(user){
                dispatchAuthState({type: 'AUTH_STATE_IS_READY', payload: {...user}});
            }else{
                dispatchAuthState({type: 'AUTH_STATE_IS_READY', payload: user});
            }
        });
    }, []);


    return (
        <AuthContext.Provider value={{ user: authState, dispatchAuthState }}>
            {props.children}
        </AuthContext.Provider>
    )
}

