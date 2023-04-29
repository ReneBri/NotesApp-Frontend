import { useLogout } from '../../hooks/useLogout';
import UnverifiedEmail from '../../components/modals/unverified-email/UnverifiedEmail';

import { useContext, useEffect } from 'react';

import { AuthContext } from '../../context/authContext';
import { ModalContext } from '../../context/modalContext';

const Dashboard = props => {
    const { logout } = useLogout();
    const { user } = useContext(AuthContext);
    const { setModalState } = useContext(ModalContext)

    // useEffect(() => {
    //     if(!user.user.emailVerified){
    //         setModalState(<UnverifiedEmail />);
    //     } 
    // }, [!user.user.emailVerified, setModalState])

    return (
        <div>

            Dashboard when user is signed in.
            <button onClick={logout}>Logout</button>
        </div>
    )
}

export default Dashboard;