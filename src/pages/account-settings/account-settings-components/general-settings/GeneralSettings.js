// styles
import styles from '../../AccountSettings.module.css';

// config

// context

// hooks
import { useState } from 'react';

// components
import DisplayName from './display-name/DisplayName';


const GeneralSettings = ({ displayName, email }) => {

  // This links up to the id of the input
  const [infoToChange, setInfoToChange] = useState(null);

  return (

    <div className={styles['account-settings-content']}>

      <h2>General Settings</h2>
      
      <DisplayName infoToChange={infoToChange} setInfoToChange={setInfoToChange} displayName={displayName} />
      
      <div className={styles['info-wrapper']}>
        <div className={styles['info-label-wrapper']}>
          <label htmlFor='user-email'>Email:</label>
          <p id='user-email'>{email}</p>
        </div>
      </div>

    </div>
  )
}

export default GeneralSettings;