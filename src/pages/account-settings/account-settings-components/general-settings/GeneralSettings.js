import { useState } from 'react';
import styles from '../../AccountSettings.module.css';

import { useValidateUserInput } from '../../../../hooks/useValidateUserInput';


const GeneralSettings = ({ displayName, email }) => {

  const [infoToChange, setInfoToChange] = useState(null);

  const [currentDisplayName, setCurrentDisplayName] = useState(displayName);

  const { validateDisplayName, userInputErrorMessage }= useValidateUserInput();

  const handleEditInformation = (section) => {
    setInfoToChange(section);
  }

  const handleSaveNewDisplayName = (newDisplayName) => {
    validateDisplayName(newDisplayName);
    console.log(userInputErrorMessage);
    if(!userInputErrorMessage){
      handleEditInformation(null);
    }
  }


  return (
    <div className={styles['account-settings-content']}>

      <h2>General Settings</h2>
      
      {infoToChange !== 'display-name' ? (
        <div className={styles['info-wrapper']}>
        <div className={styles['info-label-wrapper']}>
          <label htmlFor='display-name'>Display Name:</label>
          <p id='display-name'>{displayName}</p>
        </div>
        <button onClick={() => handleEditInformation('display-name')}>Edit</button>
      </div>
      ) : ( 
        <div className={styles['info-wrapper']}>
        <div className={styles['info-label-wrapper']}>
          <label htmlFor='display-name'>Display Name:</label>
          <input 
            id='display-name'
            type='text'
            value={currentDisplayName}
            onChange={(e) => setCurrentDisplayName(e.target.value)} 
            autoFocus
          />
        </div>
        <button onClick={() => handleSaveNewDisplayName(currentDisplayName)}>Save</button>
        <button onClick={() => {
            setCurrentDisplayName(displayName);
            handleEditInformation(null)}
            }
          >Cancel
        </button>
      </div>
      )}
      

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