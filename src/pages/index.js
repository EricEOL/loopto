import { useEffect, useState } from 'react';
import Head from 'next/head'
import { LineGraphic } from '../components/LineGraphic';
import moment from 'moment';
import styles from './home.module.scss';

export default function Home({ rippleDates, ripplePrices, chainlinkDates, chainlinkPrices }) {

  const [ripple, setRipple] = useState([]);
  const [chainlink, setChainlink] = useState([]);
  const [reloadData, setReloadData] = useState(0);

  useEffect( async () => {
    const rippleData = await fetch('https://api.coingecko.com/api/v3/coins/ripple?localization=false&community_data=false&developer_data=false&sparkline=false')
      .then(response => response.json())
      .then(data => data);

    const rippleFormated = {
      brl_price: parseFloat(rippleData.market_data.current_price.brl.toFixed(3)),
      usd_price: parseFloat(rippleData.market_data.current_price.usd.toFixed(3)),
      last_24hours: parseFloat(rippleData.market_data.price_change_percentage_24h.toFixed(2)),
      image: rippleData.image.small
    }
    setRipple(rippleFormated);

    const chainlinkData = await fetch('https://api.coingecko.com/api/v3/coins/chainlink?localization=false&community_data=false&developer_data=false&sparkline=false')
      .then(response => response.json())
      .then(data => data);

    const chainlinkFormated = {
      brl_price: parseFloat(chainlinkData.market_data.current_price.brl.toFixed(3)),
      usd_price: parseFloat(chainlinkData.market_data.current_price.usd.toFixed(3)),
      last_24hours: parseFloat(chainlinkData.market_data.price_change_percentage_24h.toFixed(2)),
      image: chainlinkData.image.small
    }
    setChainlink(chainlinkFormated);

  }, [reloadData]);

  setInterval(()=>{
    setReloadData(reloadData + 1);
  }, 10000)

  return (
    <>
      <Head>
        <title>Loopto - Home</title>
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
            <img src={chainlink.image} alt="chainlink" />
            <h2>Chainlink</h2>
            <span>BRL: <strong>{chainlink.brl_price}</strong></span>
            <span>USD: <strong>{chainlink.usd_price}</strong></span>
            <span>24h: <strong className={chainlink.last_24hours > 0 ? styles.up : styles.down}>{chainlink.last_24hours}%</strong></span>
          </div>
          <LineGraphic data={chainlinkPrices} labels={chainlinkDates} title="chainlink" />
        </div>
      </main>

    </>
  )
}

export const getServerSideProps = async () => {

  const timestampToday = Date.now();
  const timestamp3monthsAgo = moment(timestampToday).subtract('months', 3).unix();

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

  let chainlinkDates = [];
  let chainlinkPrices = [];

  const chainlinkPriceRange = await fetch(`https://api.coingecko.com/api/v3/coins/chainlink/market_chart/range?vs_currency=usd&from=${timestamp3monthsAgo}&to=${timestampToday}`)
    .then(response => response.json())
    .then(data => data);

  const chainlinkDataPrices = chainlinkPriceRange.prices;
  const filterchainlinkPrices = chainlinkDataPrices.filter((price, index) => index >= pricesLength - 20);

  filterchainlinkPrices.map(item => {

    const date = moment(item[0]).format('DD/MM/YYYY');
    const price = parseFloat(item[1]).toFixed(2);

    chainlinkDates.push(date);
    chainlinkPrices.push(price);
  })

  return {
    props: {
      rippleDates,
      ripplePrices,
      chainlinkDates,
      chainlinkPrices
    }
  }
}
