"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getPosts, Post } from '../lib/api';

export default function PostsList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPosts();
        setPosts(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <section>
      <h1>Latest Posts</h1>
      {posts.length === 0 && <p>No posts yet.</p>}
      <ul className="post-list">
        {posts.map((post) => (
          <li key={post.id} className="post-item">
            <h2>
              <Link href={`/posts/${post.id}`}>{post.title}</Link>
            </h2>
            <p className="meta">{new Date(post.created_at).toLocaleString()}</p>
            <p>
              {post.content.length > 150
                ? `${post.content.slice(0, 150)}...`
                : post.content}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
