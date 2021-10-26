import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.scss";
import Posts from "../components/posts";

Home.getInitialProps = async () => {
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
        Theme
        Post
      }
    }
  `;

  function fetchMyQuery() {
    return fetchGraphQL(operationsDoc, "MyQuery", {});
  }

  const response = await fetchMyQuery();

  return {
    posts: response.data.Posts,
  };
};

export default function Home({ posts }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Blog</title>
        <link rel="icon" href="/blog-icon.svg" />
      </Head>

      <header>
        <Image src="/Blog.jpg" alt="blog icon" width={300} height={80} />
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
  );
}
