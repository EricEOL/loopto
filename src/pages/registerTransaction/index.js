import Head from 'next/head';
import { useState } from 'react';
import styles from './styles.module.scss';

export default function RegisterTransaction() {

    const [cryptocurrency, setCryptocurrency] = useState('');
    const [date, setDate] = useState('');
    const [price, setPrice] = useState('');
    const [amount, setAmount] = useState('');

    const [sendingOk, setSendingOk] = useState([]);
    const [error, setError] = useState([]);

    function handleSubmit(event) {

        event.preventDefault();

        const data = {
            cryptocurrency,
            date,
            price,
            amount
        }

        try {
            fetch('http://localhost:3000/api/transaction', {
                method: 'post',
                body: JSON.stringify(data),
            })

            setSendingOk('Compra inserida!')
            setError('');
        } catch (error) {
            setError('Não foi possível inserir essa transação.');
            setSendingOk('')
        }
    }

    return (
        <>
            <Head>
                <title>Loopto - Nova transação</title>
            </Head>

            <form onSubmit={handleSubmit} className={styles.formTransaction}>
                <h2>Nova transação</h2>
                <p>
                    <label>Criptomoeda</label>
                    <input type="text" onChange={(e) => setCryptocurrency(e.target.value)} />
                </p>
                <p>
                    <label>Data</label>
                    <input type="date" onChange={(e) => setDate(e.target.value)} />
                </p>
                <p>
                    <label>Preço</label>
                    <input type="float" onChange={(e) => setPrice(e.target.value)} />
                </p>
                <p>
                    <label>Quantidade</label>
                    <input type="float" onChange={(e) => setAmount(e.target.value)} />
                </p>
                <button type="submit">Inserir</button>

                {error && <span className={styles.error}>{error}</span>}
                {sendingOk && <span className={styles.sendingOk}>{sendingOk}</span>}
            </form>
        </>
    )
}