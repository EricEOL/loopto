import styles from './styles.module.scss';

export function Header() {
    return (
        <header className={styles.header}>
            <img src="/logo-large.png" alt="loopto"/>
            <strong>Loopto</strong>
        </header>
    )
}