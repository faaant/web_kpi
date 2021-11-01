import "../styles/globals.scss";
import { Client, defaultExchanges, subscriptionExchange, Provider } from "urql";
import { SubscriptionClient } from "subscriptions-transport-ws";
var WebSocketClient = require("websocket").client;

const subscriptionClient = new SubscriptionClient(
  "ws://weblab3.herokuapp.com/v1/graphql",
  { reconnect: true },
  WebSocketClient
);

const client = new Client({
  url: "https://weblab3.herokuapp.com/v1/graphql",
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
