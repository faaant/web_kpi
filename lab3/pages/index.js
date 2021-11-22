import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.scss";
import Posts from "../components/posts";
import Form from "../components/Form";
import Messager from "../components/Messager";
import { useState } from "react";
import { useSubscription } from "urql";

export default function Home() {
  let [formVisibility, setFormVisibility] = useState(false);
  let [message, setMessage] = useState("");

  const subscription = `
    subscription {
      Posts {
        Theme
        Post
      }
    }
  `;
  const [result] = useSubscription({ query: subscription });

  const { data, fetching, error } = result;
  if (error) {
    setMessage("Error with updating data");
    setTimeout(() => {
      setMessage("");
    }, 2000);
  }
  async function closeForm() {
    setFormVisibility(false);
  }

  return (
    <>
      <Messager message="" />
      {formVisibility === true ? <Form close={closeForm} /> : <></>}
      <div className={styles.container}>
        <Head>
          <title>Blog</title>
          <link rel="icon" href="/blog-icon.svg" />
        </Head>

        <header>
          <Image src="/Blog.jpg" alt="blog icon" width={300} height={80} />
          <div className={styles.add} onClick={() => setFormVisibility(true)}>
            <div></div>
          </div>
        </header>
        {!fetching ? (
          <main>
            <Posts posts={data.Posts} />
          </main>
        ) : (
          <div className={styles.loader}>
            <img src="/loader.gif" alt="loader" />
          </div>
        )}
        <footer></footer>
      </div>
    </>
  );
}
