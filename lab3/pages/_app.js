import "../styles/globals.scss";
import { Client, defaultExchanges, subscriptionExchange, Provider } from "urql";
import { SubscriptionClient } from "subscriptions-transport-ws";
var WebSocketClient = require("websocket").client;

const subscriptionClient = new SubscriptionClient(
  process.env.HEROKUWS,
  { reconnect: true },
  WebSocketClient
);

const client = new Client({
  url: process.env.HEROKU,
  exchanges: [
    ...defaultExchanges,
    subscriptionExchange({
      forwardSubscription: (operation) => subscriptionClient.request(operation),
    }),
  ],
});

function MyApp({ Component, pageProps }) {
  return (
    <Provider value={client}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
