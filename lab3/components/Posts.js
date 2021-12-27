import styles from "../styles/Posts.module.scss";

function Post({ theme, post, deletePost }) {
  return (
    <div className={styles["post-container"]}>
      <div className={styles.delete} onClick={deletePost}></div>
      <span>{theme}</span>
      <p>{post}</p>
    </div>
  );
}

export default function Posts({ posts, deletePost }) {
  return posts.map((post) => (
    <Post
      theme={post.Theme}
      post={post.Post}
      deletePost={deletePost}
      key={post.Theme + post.Posts + Math.random() * 10000000}
    />
  ));
}
