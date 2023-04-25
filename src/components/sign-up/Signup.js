import ModalCard from '../UI/modal-card/ModalCard';
import ModalBackground from '../UI/modal-background/ModalBackground';
import { useReducer } from 'react';

// controlling the first name state
const firstNameReducer = (state, action) => {
    switch (action.type) {
        case ('CHANGE_FIRSTNAME_VALUE'):
            console.log(action.payload);
            return {...state, value: action.payload};
        default: return {...state};
    }
};

// controlling the email state
const emailReducer = (state, action) => {
    switch (action.type) {
        case 'CHANGE_EMAIL_VALUE':
            console.log(action.payload);
            return {...state, value: action.payload};

        default: return {...state}
    }
};

const Signup = props => {

    const [firstNameState, dispatchFirstName] = useReducer(firstNameReducer, { value: '', isValid: null})
    const [emailState, dispatchEmail] = useReducer(emailReducer, { value: '', isValid: null });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('ive been clicked');
    }

    return (
        <ModalBackground>
            <ModalCard>
                <object data="/icons/close.svg" width="24" height="24"> </object>
                <h3>Sign-up with Email & Password</h3>
                <form onSubmit={handleSubmit}>
                    
                    <label>
                        <span>*First Name:</span>
                        <input 
                            type='text' 
                            value={firstNameState.value}
                            onChange={(e) => dispatchFirstName({
                                type: 'CHANGE_FIRSTNAME_VALUE',
                                payload: e.target.value
                            })}
                        />
                    </label>

                    <label>
                        <span>*Email:</span>
                        <input 
                            type='email'
                            value={emailState.value}
                            onChange={(e) => dispatchEmail({ 
                                    type: 'CHANGE_EMAIL_VALUE', 
                                    payload: e.target.value 
                            })}  
                        />
                    </label>

                    <label>
                        <span>*Password:</span>
                        <input type='email' />
                    </label>

                    <label>
                        <span>*Confirm Password:</span>
                        <input type='email' />
                    </label>
                    
                    <button>Create Account!</button>
                </form>
            </ModalCard>
        </ModalBackground>
    )
}

export default Signup;