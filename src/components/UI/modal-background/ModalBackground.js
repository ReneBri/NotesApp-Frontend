import styles from './ModalBackground.module.css';

const ModalBackground = props => {
    return (
        <div className={styles.modalBackground}>
            {props.children}
        </div>
    )
}

export default ModalBackground;