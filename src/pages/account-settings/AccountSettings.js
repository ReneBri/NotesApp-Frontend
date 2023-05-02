// styles
import styles from './AccountSettings.module.css';

// config

// context
import { ModalContext } from "../../../context/modalContext";
import { AuthContext } from '../../../context/authContext';

// hooks
import { useContext } from 'react';

// components


const AccountSettings = props => {

    const { user } = useContext(AuthContext);

    return (
        <div>
            
        </div>
    )
}

export default AccountSettings;