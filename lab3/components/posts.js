function Post({ theme, post }) {
  return (
    <div>
      {theme}
      <p>{post}</p>
    </div>
  );
}

export default function Posts({ posts }) {
  return posts.map((post) => (
    <Post
      theme={post.Theme}
      post={post.Post}
      key={post.Theme + post.Posts + Math.random() * 10000000}
    />
  ));
}
