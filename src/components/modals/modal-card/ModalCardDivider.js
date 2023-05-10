import styles from './ModalCardDivider.module.css';

const ModalCardDivider = () => {

    return (
        <div className={styles['modal-card-divider']}>
        <hr />
        <p><strong>OR</strong></p>
        </div>
    )
}

export default ModalCardDivider;