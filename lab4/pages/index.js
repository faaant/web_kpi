import Head from "next/head";
import Burger from "../components/burger/Burger";
import Slider from "../components/slider/Slider";
export default function Home() {
  return (
    <>
      <Head>
        <title>Only html/css components</title>
        <link rel="icon" href="/icon.jpg" />
      </Head>

      <Slider />
      <Burger />
    </>
  );
}
