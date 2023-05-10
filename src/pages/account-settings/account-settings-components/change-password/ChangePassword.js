import styles from '../../AccountSettings.module.css';

import { AuthContext } from '../../../../context/authContext';
import { useContext } from 'react';
import ChangePasswordHasPassword from './ChangePasswordHasPassword';
import ChangePasswordCreatePassword from './ChangePasswordCreatePassword';

const ChangePassword = props => {



    const { user } = useContext(AuthContext);
    

    return (
        <div className={styles['account-settings-content']}>
            <h2>Change Password</h2>
            {user.hasPassword ? <ChangePasswordHasPassword /> : <ChangePasswordCreatePassword />}
        </div>
    )
}

export default ChangePassword;