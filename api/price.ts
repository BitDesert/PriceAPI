import { NowRequest, NowResponse } from '@vercel/node'
import axios from 'axios';
const NodeCache = require("node-cache");

const apiUrl = `https://api.coingecko.com/api/v3/coins/nano?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`;

const apiCache = new NodeCache({
  stdTTL: 120,
  deleteOnExpire: true,
});

const apiCacheKey = 'coingecko-nano';

export default async (req: NowRequest, res: NowResponse) => {
  let priceData = apiCache.get(apiCacheKey);

  if (!priceData) {
    console.log('Not cached');

    try {
      const priceDataNew = await axios.get(apiUrl);
      priceData = priceDataNew.data

      apiCache.set(apiCacheKey, priceData);
    } catch (err) {
      console.error(err);
    }
  }

  res.json(priceData)
}
