// styles
import styles from '../../../AccountSettings.module.css';

// config
import firebaseAuth from '../../../../../config/firebaseConfig';

// context
import { AuthContext } from '../../../../../context/authContext';

// hooks
import { useContext, useReducer } from 'react';
import { useValidateUserInput } from '../../../../../hooks/useValidateUserInput';

// components


const DisplayName = ({ infoToChange, setInfoToChange, displayName }) => {

  // use AuthContext
  const { dispatchAuthState } = useContext(AuthContext);

  // This validates the newly chosen display name
  const { validateDisplayName, userInputErrorMessage } = useValidateUserInput();

  // Reducer for the user input
  const reduceCurrentDisplayName = (state, action) => {
    switch(action.type){
      case 'UPDATE_CURRENT_DISPLAY_NAME':
        return { currentDisplayName: action.payload, currentDisplayNameIsValid: validateDisplayName(action.payload) };
      default:
        return { ...state };
    }
  }

  // State for the display name shown on the page which is linked to the input field
  const [currentDisplayNameState, dispatchCurrentDisplayName] = useReducer(reduceCurrentDisplayName, { 
    currentDisplayName: displayName, 
    currentDisplayNameIsValid: true
  });

  // Update the displayName property in the Firebase system
  const updateFirebaseDisplayName = async () => {
    try{
      await firebaseAuth.currentUser.updateProfile({
        displayName: currentDisplayNameState.currentDisplayName
    });
    console.log('success');
    return;
    }
    catch(err){
      console.log(err.message);
      console.log('fail');
    }
  }

  // Triggered when clicking the save button
  const handleSubmit = (e) => {
    e.preventDefault();
    if(currentDisplayNameState.currentDisplayNameIsValid){
      updateFirebaseDisplayName();
      setInfoToChange(null);
      dispatchAuthState({ 
        type: 'UPDATE_DISPLAY_NAME', 
        payload: currentDisplayNameState.currentDisplayName 
      });
    }
  }


  return (
      <>
        {infoToChange !== 'display-name' ? (
            <div className={styles['info-wrapper']}>
              <div className={styles['info-label-wrapper']}>
                  <label htmlFor='display-name'>Display Name:</label>
                  <p id='display-name'>{currentDisplayNameState.currentDisplayName}</p>
              </div>
              <button onClick={() => setInfoToChange('display-name')}>Edit</button>
            </div>
        ) : ( 
            <>
            <form className={styles['info-wrapper']}>
                <div className={styles['info-label-wrapper']}>
                <label htmlFor='display-name'>Display Name:</label>
                <input 
                    id='display-name'
                    type='text'
                    value={currentDisplayNameState.currentDisplayName}
                    onChange={(e) => dispatchCurrentDisplayName({ 
                      type: 'UPDATE_CURRENT_DISPLAY_NAME', 
                      payload: e.target.value 
                    })} 
                    autoFocus
                />
                </div>
                <button onClick={handleSubmit}>Save</button>
                <button onClick={(e) => {
                    e.preventDefault();
                    dispatchCurrentDisplayName({ 
                      type: 'UPDATE_CURRENT_DISPLAY_NAME', 
                      payload: displayName 
                    });
                    setInfoToChange(null)}
                    }
                >Cancel
                </button>
            </form>
            {userInputErrorMessage && (
                <p>{userInputErrorMessage}</p>
            )}
            </>
        )}
      </>
  )
}

export default DisplayName;