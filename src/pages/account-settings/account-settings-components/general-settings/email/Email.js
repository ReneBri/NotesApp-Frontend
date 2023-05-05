// styles
import styles from '../../../AccountSettings.module.css';

// config
import firebaseAuth from '../../../../../config/firebaseConfig';

// context
import { AuthContext } from '../../../../../context/authContext';
import { ModalContext } from '../../../../../context/modalContext';

// hooks
import { useContext, useReducer } from 'react';
import { useValidateUserInput } from '../../../../../hooks/useValidateUserInput';
import { useReauthenticateUser } from '../../../../../hooks/useReauthenticateUser';

// components
import ReauthenticateUser from '../../../../../components/modals/reauthenticate-user/ReauthenticateUser';


const Email = ({ infoToChange, setInfoToChange, email }) => {

    // use AuthContext
    const { dispatchAuthState } = useContext(AuthContext);

    const { setModalState } = useContext(ModalContext)

    // This validates the newly chosen display name
    const { validateEmail, userInputErrorMessage } = useValidateUserInput();

    // Reducer for the user input
    const reduceCurrentEmail = (state, action) => {
        switch(action.type){
            case 'UPDATE_CURRENT_EMAIL':
                return { value: action.payload, isValid: validateEmail(action.payload) };
            default:
                return { ...state };
        }
    }

    // State for the display name shown on the page which is linked to the input field
    const [currentEmailState, dispatchCurrentEmail] = useReducer(reduceCurrentEmail, { 
        value: email, 
        isValid: true
    });

    // Update the displayName property in the Firebase system
    const updateFirebaseEmail = async () => {
        try{
            await firebaseAuth.currentUser.updateEmail(currentEmailState.value);
        }
        catch(err){
            console.log(err.message);
            console.log('fail');
        }
    }

    const unverifyEmail = async () => {
        try{
            await firebaseAuth.currentUser.updateProfile({
                emailVerified: false
            });
        }
        catch(err){
            console.log(err.message);
            console.log('fail');
        }
    }

    const resendEmailVerification = async () => {
        try{
            await firebaseAuth.currentUser.sendEmailVerification();
        }
        catch(err){
            console.log(err.message);
            console.log('fail');
        }
    }

    const handleUpdateEmail = async () => {
        if(currentEmailState.isValid){
            await updateFirebaseEmail();
            await unverifyEmail();
            resendEmailVerification();
            setInfoToChange(null);
            dispatchAuthState({ 
            type: 'UPDATE_EMAIL', 
            payload: currentEmailState.value
            });
        }
    }

    // Triggered when clicking the save button
    const handleSubmit = async (e) => {
        e.preventDefault();
        setModalState(<ReauthenticateUser 
            message1={`Are you sure you want to change your email to ${currentEmailState.value}?`} 
            message2={`Enter your password to continue.`} 
            onSuccessfulCompletion={handleUpdateEmail} 
        />);
    }


    return (
        <>
            {infoToChange !== 'email' ? (
                <div className={styles['info-wrapper']}>
                <div className={styles['info-label-wrapper']}>
                    <label htmlFor='user-email'>Email:</label>
                    <p id='user-email'>{email}</p>
                </div>
                <button onClick={() => setInfoToChange('email')}>Edit</button>
                </div>
            ) : ( 
                <>
                <form className={styles['info-wrapper']}>
                    <div className={styles['info-label-wrapper']}>
                    <label htmlFor='email'>Email:</label>
                    <input 
                        id='email'
                        type='email'
                        value={currentEmailState.value}
                        onChange={(e) => dispatchCurrentEmail({ 
                        type: 'UPDATE_CURRENT_EMAIL', 
                        payload: e.target.value 
                        })} 
                        autoFocus
                    />
                    </div>
                    <button onClick={handleSubmit}>Save</button>
                    <button onClick={(e) => {
                        e.preventDefault();
                        dispatchCurrentEmail({ 
                        type: 'UPDATE_CURRENT_EMAIL', 
                        payload: email 
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

export default Email;