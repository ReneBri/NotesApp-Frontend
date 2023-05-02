// styles
import styles from './AccountSettings.module.css';

// config

// context
import { ModalContext } from '../../context/modalContext';
import { AuthContext } from '../../context/authContext';

// hooks
import { useState, useContext } from 'react';

// components
import AccountSettingsSidebar from './account-settings-components/sidebar/AccountSettingsSidebar';
import GeneralSettings from './account-settings-components/general-settings/GeneralSettings';
import ChangePassword from './account-settings-components/change-password/ChangePassword';


const AccountSettings = props => {

    const { user } = useContext(AuthContext);

    const [informationSelection, setInformationSelection] = useState('general-settings')

    return (
        <div className={styles['account-settings-page']}>

            <AccountSettingsSidebar setInformationSelection={setInformationSelection} />

            {informationSelection === 'general-settings' && (
                <GeneralSettings 
                    displayName={user.user.displayName} 
                    email={user.user.email}
                />
            )}

            {informationSelection === 'change-password' && (
                <ChangePassword />
            )}

        </div>
    )
}

export default AccountSettings;