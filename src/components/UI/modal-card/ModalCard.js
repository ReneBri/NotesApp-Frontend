import styles from './ModalCard.module.css';

const ModalCard = props => {
    return (
        <div className={styles.modalCard}>
            {props.children}
        </div>
    )
}

export default ModalCard;