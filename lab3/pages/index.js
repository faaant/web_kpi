import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.scss";
import Posts from "../components/posts";
import Form from "../components/form";
import { useState } from "react";

export default function Home() {
  let [formVisibility, setFormVisibility] = useState(false);
  let [posts, setPosts] = useState([]);

  async function fetchGraphQL(operationsDoc, operationName, variables) {
    const result = await fetch("https://weblab3.herokuapp.com/v1/graphql", {
      method: "POST",
      body: JSON.stringify({
        query: operationsDoc,
        variables: variables,
        operationName: operationName,
      }),
    });

    return await result.json();
  }

  const operationsDoc = `
    query MyQuery {
      Posts {
        Post
        Theme
      }
    }
  `;

  function fetchMyQuery() {
    return fetchGraphQL(operationsDoc, "MyQuery", {});
  }

  async function startFetchMyQuery() {
    const { errors, data } = await fetchMyQuery();
    if (posts.length != data.Posts.length) {
      setPosts(data.Posts);
    }
  }
  startFetchMyQuery();

  function closeForm() {
    setFormVisibility(false);
  }

  async function refreshData() {
    startFetchMyQuery();
  }
  return (
    <>
      {formVisibility === true ? (
        <Form close={closeForm} refresh={refreshData} />
      ) : (
        <></>
      )}
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
        {posts.length ? (
          <main>
            <Posts posts={posts} />
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
