// styles

// config
import firebaseAuth from '../../config/firebaseConfig';

// context
import { AuthContext } from '../../context/authContext';

// hooks
import { useEffect, useState, useReducer, useContext} from 'react'

// components

const initialDeleteUserState = {
    isPending: false,
    error: null,
    success: null
}

const reduceDeleteUserState = (state, action) => {
    switch(action.type){
        case 'ATTEMPT_DELETE_USER':
            return {isPending: true, error: false, success: null};
        case 'DELETE_USER_COMPLETE':
            return {isPending: false, error: false, success: true};
        case 'DELETE_USER_ERROR':
            return {isPending: false, error: action.payload, success: false};
        default:
            return state;
    }
}

export const useDeleteUser = () => {

    const [deleteUserState, dispatchDeleteUserState] = useReducer(reduceDeleteUserState, initialDeleteUserState);

    const [isCancelled, setIsCancelled] = useState(false);

    const { dispatchAuthState } = useContext(AuthContext);


    const deleteUser = async () => {

        setIsCancelled(false);

        dispatchDeleteUserState({ type: 'ATTEMPT_DELETE_USER' });

        try {
            await firebaseAuth.currentUser.delete();
            if(!isCancelled){
                console.log('Triggered here!');
                dispatchDeleteUserState({ type: 'DELETE_USER_COMPLETE' });
                dispatchAuthState({ type: 'DELETE_USER' });
            }
        }
        catch(err){
            if(!isCancelled){
                dispatchDeleteUserState({type: 'DELETE_USER_ERROR', payload: err.message });
            }
        }
        
    }

    useEffect(() => {
        return () => {
            setIsCancelled(true);
            console.log('clean-up');
        }
    });

    return { deleteUser, deleteUserState };
}


