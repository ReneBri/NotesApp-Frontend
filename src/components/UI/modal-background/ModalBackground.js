import styles from './ModalBackground.module.css';

import { ModalContext } from '../../../context/modalContext';

import { useContext } from 'react';

const ModalBackground = props => {

    const { setModalState } = useContext(ModalContext);

    return (
        <div 
            className={styles.modalBackground}
            onClick={() => setModalState(null)}
        >
            {props.children}
        </div>
    )
}

export default ModalBackground;