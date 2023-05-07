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

// components
import ReauthenticateUser from '../../../../../components/modals/reauthenticate-user/ReauthenticateUser';


const Email = ({ infoToChange, setInfoToChange, email }) => {

    // Use AuthContext
    const { dispatchAuthState } = useContext(AuthContext);

    // To set the modal state
    const { setModalState } = useContext(ModalContext)

    // Validate the newly chosen display name
    const { validateEmail, userInputErrorMessage } = useValidateUserInput();

    // Reducer for the user input
    const reduceEnteredEmail = (state, action) => {
        switch(action.type){
            case 'UPDATE_ENTERED_EMAIL':
                return { value: action.payload, isValid: validateEmail(action.payload) };
            default:
                return { ...state };
        }
    }

    // State for the display name shown on the page which is linked to the input field
    const [enteredEmailState, dispatchEnteredEmail] = useReducer(reduceEnteredEmail, { 
        value: email, 
        isValid: true
    });

    ///////////////////////////////////////////////////////////////////////////////////
    // PERHAPS TURN ALL OF THIS INTO A HOOK?
    // Update the displayName property in the Firebase system
    const updateFirebaseEmail = async () => {
        try{
            await firebaseAuth.currentUser.updateEmail(enteredEmailState.value);
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
            await updateFirebaseEmail();
            await unverifyEmail();
            resendEmailVerification();
            setInfoToChange(null);
            dispatchAuthState({ 
            type: 'UPDATE_EMAIL', 
            payload: enteredEmailState.value
            });
        
    }

    ///////////////////////////////////////////////////////////////////////////////////


    // Triggered when clicking the save button
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(enteredEmailState.isValid){
            setModalState(<ReauthenticateUser 
                message1={`Are you sure you want to change your email to ${enteredEmailState.value}?`} 
                message2={`Enter your password to continue.`} 
                buttonText="Let's go!"
                onSuccessfulCompletion={handleUpdateEmail} 
                successModalMessage='Please check your inbox for a new verification email.'
            />);
        }
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
                        value={enteredEmailState.value}
                        onChange={(e) => dispatchEnteredEmail({ 
                        type: 'UPDATE_ENTERED_EMAIL', 
                        payload: e.target.value 
                        })} 
                        autoFocus
                    />
                    </div>
                    <button onClick={handleSubmit}>Save</button>
                    <button onClick={(e) => {
                        e.preventDefault();
                        dispatchEnteredEmail({ 
                        type: 'UPDATE_ENTERED_EMAIL', 
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