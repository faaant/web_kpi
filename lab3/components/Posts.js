import styles from "../styles/Posts.module.scss";

function Post({ id, theme, post, deletePost }) {
  return (
    <div id={id} className={styles["post-container"]}>
      <div className={styles.delete} onClick={deletePost}></div>
      <span>{theme}</span>
      <p>{post}</p>
    </div>
  );
}

export default function Posts({ posts, deletePost }) {
  return posts.map((post) => (
    <Post
      id={post.ID}
      theme={post.Theme}
      post={post.Post}
      deletePost={deletePost}
      key={post.ID}
    />
  ));
}
