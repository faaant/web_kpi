import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.scss";
import Posts from "../components/posts";
import { useState } from "react";

export default function Home() {
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

  function setter() {
    setRefresh(true);
  }

  async function startFetchMyQuery() {
    const { errors, data } = await fetchMyQuery();

    if (errors) {
      // handle those errors like a pro
      console.error(errors);
    }
    // do something great with this precious data
    if (posts.length == 0) {
      setPosts(data.Posts);
    }
  }
  startFetchMyQuery();

  return (
    <div className={styles.container}>
      <Head>
        <title>Blog</title>
        <link rel="icon" href="/blog-icon.svg" />
      </Head>

      <header>
        <Image src="/Blog.jpg" alt="blog icon" width={300} height={80} />
      </header>

      <main>
        {/* <div>
          Theme of post hello world   
          <p>
            hello lorem10 lorem10 lorem10 lorem10 lorem10 lorem1 0lorem 10 lorem10lorem10 hello lorem10 lorem10 lorem10 lorem10 lorem10 lorem1 0lorem 10 lorem10lorem10 hello lorem10 lorem10 lorem10 lorem10 lorem10 lorem1 0lorem 10 lorem10lorem10 hello lorem10 lorem10 lorem10 lorem10 lorem10 lorem1 0lorem 10 lorem10lorem10 
          </p>
        </div> */}
        {<Posts posts={posts} />}
      </main>

      <footer></footer>
    </div>
  );
}
