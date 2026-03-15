"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { deletePost, getPosts, Post } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    const fetchPosts = async () => {
      try {
        const data = await getPosts();
        // NOTE: For MVP we show all posts; backend does not expose user id directly.
        setPosts(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [isAuthenticated, router]);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this post?')) return;
    try {
      await deletePost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete post');
    }
  };

  if (!isAuthenticated) return null;
  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <section>
      <div className="dashboard-header">
        <h1>Your Posts</h1>
        <Link href="/posts/new" className="btn btn-primary">New Post</Link>
      </div>
      {posts.length === 0 && <p>No posts yet.</p>}
      <ul className="post-list">
        {posts.map((post) => (
          <li key={post.id} className="post-item">
            <h2>
              <Link href={`/posts/${post.id}`}>{post.title}</Link>
            </h2>
            <p className="meta">{new Date(post.created_at).toLocaleString()}</p>
            <div className="actions">
              <Link href={`/posts/${post.id}/edit`} className="btn btn-secondary">Edit</Link>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => handleDelete(post.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
