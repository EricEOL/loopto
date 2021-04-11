import Head from 'next/head'
import { LineGraphic } from '../components/LineGraphic';
import moment from 'moment';
import styles from './home.module.scss';

export default function Home({ ripple, tether, rippleDates, ripplePrices, tetherDates, tetherPrices }) {

  return (
    <>
      <Head>
        <title>Loopto</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.card}>
          <div className={styles.cardData}>
            <img src={ripple.image} alt="ripple" />
            <h2>Ripple</h2>
            <span>BRL: <strong>{ripple.brl_price}</strong></span>
            <span>USD: <strong>{ripple.usd_price}</strong></span>
            <span>24h: <strong className={ripple.last_24hours > 0 ? styles.up : styles.down}>{ripple.last_24hours}%</strong></span>
          </div>
          <LineGraphic data={ripplePrices} labels={rippleDates} title="ripple" />
        </div>
        <div className={styles.card}>
          <div className={styles.cardData}>
            <img src={tether.image} alt="tether" />
            <h2>Tether</h2>
            <span>BRL: <strong>{tether.brl_price}</strong></span>
            <span>USD: <strong>{tether.usd_price}</strong></span>
            <span>24h: <strong className={tether.last_24hours > 0 ? styles.up : styles.down}>{tether.last_24hours}%</strong></span>
          </div>
          <LineGraphic data={tetherPrices} labels={tetherDates} title="tether" />
        </div>
      </main>

    </>
  )
}

export const getServerSideProps = async () => {

  const timestampToday = Date.now();
  const timestamp3monthsAgo = moment(timestampToday).subtract('months', 3).unix();

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

  let rippleDates = [];
  let ripplePrices = [];

  const ripplePriceRange = await fetch(`https://api.coingecko.com/api/v3/coins/ripple/market_chart/range?vs_currency=usd&from=${timestamp3monthsAgo}&to=${timestampToday}`)
    .then(response => response.json())
    .then(data => data);

  const rippleDataPrices = ripplePriceRange.prices;
  const pricesLength = rippleDataPrices.length;
  const filterRipplePrices = rippleDataPrices.filter((price, index) => index >= pricesLength - 20);

  filterRipplePrices.map(item => {

    const date = moment(item[0]).format('DD/MM/YYYY');
    const price = parseFloat(item[1]).toFixed(2);

    rippleDates.push(date);
    ripplePrices.push(price);
  })

  let tetherDates = [];
  let tetherPrices = [];

  const tetherPriceRange = await fetch(`https://api.coingecko.com/api/v3/coins/tether/market_chart/range?vs_currency=usd&from=${timestamp3monthsAgo}&to=${timestampToday}`)
    .then(response => response.json())
    .then(data => data);

  const tetherDataPrices = tetherPriceRange.prices;
  const filtertetherPrices = tetherDataPrices.filter((price, index) => index >= pricesLength - 20);

  filtertetherPrices.map(item => {

    const date = moment(item[0]).format('DD/MM/YYYY');
    const price = parseFloat(item[1]).toFixed(2);

    tetherDates.push(date);
    tetherPrices.push(price);
  })

  return {
    props: {
      ripple,
      tether,
      rippleDates,
      ripplePrices,
      tetherDates,
      tetherPrices
    }
  }
}
