// styles
import styles from './Navbar.module.css';

// config

// context
import { ModalContext } from "../../../context/modalContext";
import { AuthContext } from '../../../context/authContext';

// hooks
import { useLogout } from '../../../hooks/useLogout';
import { useContext } from 'react';

// components
import Login from "../../modals/login/Login";
import Signup from "../../modals/sign-up/Signup";


const Navbar = props => {

    const { setModalState } = useContext(ModalContext);
    const { user } = useContext(AuthContext);
    const { logout } = useLogout();

    return (
        <nav className={styles.navbar}>
            <div className={styles['nav-content-wrapper']}>
                <h3>Logo</h3>
                <ul>
                    {!user.user && (
                        <>
                        <li 
                            className={styles['user-auth-link']}
                            onClick={() => setModalState(<Signup />)}
                        >Sign up
                        </li>
                        <li>|</li>
                        <li 
                            className={styles['user-auth-link']}
                            onClick={() => setModalState(<Login />)}
                            >Login
                        </li>
                        </>
                    )}
                    {user.user && (
                        <li 
                            className={styles['user-auth-link']}
                            onClick={logout}
                            >Logout
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    )
}

export default Navbar;