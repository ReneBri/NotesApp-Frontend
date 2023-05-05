import styles from '../../AccountSettings.module.css';

import { useSendPasswordResetEmail } from '../../../../hooks/authentication-hooks/useSendPasswordResetEmail';
import { AuthContext } from '../../../../context/authContext';
import { useContext } from 'react';

const ChangePassword = props => {

    const { sendPasswordResetEmail, passwordResetEmailState } = useSendPasswordResetEmail();

    const { user } = useContext(AuthContext);
    

    const handleClick = () => {
        sendPasswordResetEmail(user.user.email);
    }

    return (
        <div className={styles['account-settings-content']}>
            <h2>Change Password</h2>
            {passwordResetEmailState.success === null && <p>Click button to send password reset email.</p>}
            {passwordResetEmailState.success && <p>{`Password reset email sent to ${user.user.email}`}</p>}
            {passwordResetEmailState.success === false && <p>Password reset email failed to send.</p>}
            {!passwordResetEmailState.isPending ? <button onClick={handleClick}>Send</button> : <button disabled>Sending</button>}
        </div>
    )
}

export default ChangePassword;