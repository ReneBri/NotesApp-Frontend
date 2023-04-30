// styles
import styles from './ModalCard.module.css';
import exitIcon from '../../../media/icons/close.svg';

// config

// context
import { useContext } from 'react';
import { ModalContext } from '../../../context/modalContext';

// hooks

// components


const ModalCard = props => {

    const { setModalState } = useContext(ModalContext);

    return (
        <div className={styles.modalCard}>
            <img 
                src={exitIcon}
                onClick={() => {setModalState(null)}} 
                alt='Exit the modal here'
            />
            {props.children}
        </div>
    )
}

export default ModalCard;