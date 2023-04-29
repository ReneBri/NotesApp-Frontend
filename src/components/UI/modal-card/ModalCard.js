import styles from './ModalCard.module.css';

import { ModalContext } from '../../../context/modalContext';

import { useContext } from 'react';

import exitIcon from '../../../media/icons/close.svg';

const ModalCard = props => {

    const { setModalState } = useContext(ModalContext);

    return (
        <div className={styles.modalCard}>
            <img 
                src={exitIcon}
                onClick={() => {setModalState(null)}} 
                alt='Exit the modal here'
            />
            {/* <object 
                data="/icons/close.svg" 
                width="24" 
                height="24"
                onClick={() => {setModalContext(null)}}
            > </object> */}
            {props.children}
        </div>
    )
}

export default ModalCard;