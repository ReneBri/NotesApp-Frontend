import React, { useState } from 'react';

export const AuthContext = React.createContext();

export const AuthContextProvider = props => {
    const [user, setUser] = useState('Bob');

    return (
        <AuthContext.Provider value={{ user: user }}>
            {props.children}
        </AuthContext.Provider>
    )
}

