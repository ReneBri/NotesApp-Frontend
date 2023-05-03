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

    return { validateDisplayName, userInputErrorMessage }
}