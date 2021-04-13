import Link from 'next/link';
import styles from './styles.module.scss';

export function NewTransactionButton() {
    return (
        <Link href="/registerTransaction">
            <button className={styles.button}>Nova transação</button>
        </Link>
    )
}