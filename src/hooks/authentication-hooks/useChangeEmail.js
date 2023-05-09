import { useState } from "react";

import firebaseAuth from "../../config/firebaseConfig";

export const useChangeEmail = () => {

    const [changeEmailError, setChangeEmailError] = useState(null);


    const updateFirebaseEmail = async (newEmail) => {
        try{
            await firebaseAuth.currentUser.updateEmail(newEmail);
        }
        catch(err){
            setChangeEmailError(err.message);
            return;
        }
    }

    const unverifyEmail = async () => {
        try{
            await firebaseAuth.currentUser.updateProfile({
                emailVerified: false
            });
        }
        catch(err){
            setChangeEmailError(err.message);
            return;
        }
    }

    const resendEmailVerification = async () => {
        try{
            await firebaseAuth.currentUser.sendEmailVerification();
        }
        catch(err){
            setChangeEmailError(err.message);
            return;
        }
    }

    return { updateFirebaseEmail, unverifyEmail, resendEmailVerification, changeEmailError };
}