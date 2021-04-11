import Head from 'next/head'
import styles from './home.module.scss';

export default function Home({ ripple, data, tether }) {
  console.log(data);

  return (
    <>
      <Head>
        <title>Loopto</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.card}>
          <div>
            <img src={ripple.image} alt="ripple" />
            <h2>Ripple</h2>
          </div>
          <span>BRL: <strong>{ripple.brl_price}</strong></span>
          <span>USD: <strong>{ripple.usd_price}</strong></span>
          <span>24h: <strong className={ripple.last_24hours > 0 ? styles.up : styles.down}>{ripple.last_24hours}%</strong></span>
        </div>
        <div className={styles.card}>
          <div>
            <img src={tether.image} alt="tether" />
            <h2>Tether</h2>
          </div>
          <span>BRL: <strong>{tether.brl_price}</strong></span>
          <span>USD: <strong>{tether.usd_price}</strong></span>
          <span>24h: <strong className={tether.last_24hours > 0 ? styles.up : styles.down}>{tether.last_24hours}%</strong></span>
        </div>
      </main>

    </>
  )
}

export const getServerSideProps = async () => {

  const rippleData = await fetch('https://api.coingecko.com/api/v3/coins/ripple?localization=false&community_data=false&developer_data=false&sparkline=false')
    .then(response => response.json())
    .then(data => data);

  const ripple = {
    brl_price: parseFloat(rippleData.market_data.current_price.brl.toFixed(2)),
    usd_price: parseFloat(rippleData.market_data.current_price.usd.toFixed(2)),
    last_24hours: parseFloat(rippleData.market_data.price_change_percentage_24h.toFixed(2)),
    image: rippleData.image.small
  }

  const tetherData = await fetch('https://api.coingecko.com/api/v3/coins/tether?localization=false&community_data=false&developer_data=false&sparkline=false')
    .then(response => response.json())
    .then(data => data);

  const tether = {
    brl_price: parseFloat(tetherData.market_data.current_price.brl.toFixed(2)),
    usd_price: parseFloat(tetherData.market_data.current_price.usd.toFixed(2)),
    last_24hours: parseFloat(tetherData.market_data.price_change_percentage_24h.toFixed(2)),
    image: tetherData.image.small
  }

  return {
    props: {
      ripple,
      data: rippleData,
      tether,
    }
  }
}
