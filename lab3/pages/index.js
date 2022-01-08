import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.scss";
import Posts from "../components/Posts";
import Form from "../components/Form";
import Messager from "../components/Messager";
import { startExecuteMyMutation } from "../requests/mutation";
import { useState } from "react";
import { useSubscription } from "urql";

export default function Home() {
  let [formVisibility, setFormVisibility] = useState(false);
  let [message, setMessage] = useState("");

  const subscription = `
    subscription {
      Posts {
        ID
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

  function setter() {
    setMessage("");
  }

  async function deletePost(e) {
    if (e.target.parentNode.children[1]?.innerHTML) {
      const operationsDoc = `
        mutation MyMutation {
          delete_Posts(where: {Theme: {_eq: "${e.target.parentNode.childNodes[1].innerHTML}"}}){
            affected_rows
          }
        }
      `;
      startExecuteMyMutation(operationsDoc)
        .then(() => {
          setMessage("Deleted!");
        })
        .catch(() => {
          setMessage("Error with request!");
        })
        .finally(() => {
          setTimeout(setter, 2000);
        });
    }
  }

  return (
    <>
      <Messager message={message} />
      {formVisibility ? <Form close={closeForm} /> : <></>}
      <div className={styles.container}>
        <Head>
          <title>Blog</title>
          <link rel="icon" href="/blog-icon.svg" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
        </Head>

        <header>
          <Image src="/Blog.jpg" alt="blog icon" width={300} height={80} />
          <div className={styles.add} onClick={() => setFormVisibility(true)}>
            <div></div>
          </div>
        </header>
        {!fetching ? (
          <main>
            <Posts posts={data.Posts} deletePost={deletePost} />
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
