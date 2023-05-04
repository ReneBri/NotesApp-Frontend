import { useState } from "react";


export const useValidateUserInput = () => {

    const [userInputErrorMessage, setUserInputErrorMessage] = useState(null);

    const validateDisplayName = (userInput) => {
        if (userInput.trim().match(/^[A-Za-z]+$/) && userInput.trim().length > 0 && userInput.trim().length < 15){
            setUserInputErrorMessage(null);
            return true;
        }else{
            setUserInputErrorMessage('Name must only contain alphabetic characters and be between 1 & 15 letters long.')
            return false;
        }
    }

    const validateEmail = (userInput) => {
        if (userInput.trim().match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)){
            setUserInputErrorMessage(null);
            return true;
        }else{
            setUserInputErrorMessage('Must be a valid email address.')
            return false;
        }
    }

    const validatePassword = (userInput) => {
        if (userInput.length !== 0){
            setUserInputErrorMessage(null);
            return true;
        }else{
            setUserInputErrorMessage('Please enter a password.')
            return false;
        }
    }

    return { validateDisplayName, validateEmail, validatePassword, userInputErrorMessage }
}