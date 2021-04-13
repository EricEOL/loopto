import Link from 'next/link';
import { NewTransactionButton } from '../NewTransactionButton';
import styles from './styles.module.scss';

export function Header() {
    return (
        <header className={styles.header}>
            <div>
                    <img src="/logo-large.png" alt="loopto" />
                <Link href="/">
                    <strong>Loopto</strong>
                </Link>
            </div>
            <NewTransactionButton />
        </header>
    )
}