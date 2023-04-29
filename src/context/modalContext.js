import React, { useState } from 'react';

const initialModalContext = {
    modalName: null
}

export const ModalContext = React.createContext(initialModalContext);

const ModalContextProvider = props => {

    const [modalState, setModalState] = useState(null);

    return (
        <ModalContext.Provider value={{ modalState, setModalState }}>
            {props.children}
        </ModalContext.Provider>
    )
}

export default ModalContextProvider;