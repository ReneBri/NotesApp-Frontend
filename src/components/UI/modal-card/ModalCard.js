import styles from './ModalCard.module.css';

const ModalCard = props => {
    return (
        <div className={styles.modalCard}>
            <object data="/icons/close.svg" width="24" height="24"> </object>
            {props.children}
        </div>
    )
}

export default ModalCard;