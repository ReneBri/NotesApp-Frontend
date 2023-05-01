// styles

// config
import firebaseAuth from '../config/firebaseConfig';

// context

// hooks
import React, { useEffect, useReducer } from 'react';

// components


// Initialize the context
export const AuthContext = React.createContext();

// Manage the AuthState
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

// Wrapper component for context ease of use. We wrap the entire "App" component in this. See App.js.
export const AuthContextProvider = props => {

    // Declare the authState with 'authIsReady' set to null. This is so we can block the loading of any data until Firebase has confirmed wether a user is already logged in or not. This helps keep restricted data restricted.
    const [authState, dispatchAuthState] = useReducer(authStateReducer, { user: null, authIsReady: false });

    // 'onAuthStateChanged' checks to see wether a user is already logged in upon load and 'dispatchAuth' updates the state accordingly. This is so that if a user refreshes the page and is already logged in, the state will update accordingly keeping Firebase and the clients local state, insync.
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

