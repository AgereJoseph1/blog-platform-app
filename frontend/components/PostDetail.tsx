"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { deletePost, getPost, Post } from '../lib/api';
import { useAuth } from '../context/AuthContext';

interface Props {
  id: number;
}

export default function PostDetail({ id }: Props) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPost(id);
        setPost(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!post) return;
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await deletePost(post.id);
      router.push('/');
    } catch (err: any) {
      alert(err.message || 'Failed to delete post');
    }
  };

  if (loading) return <p>Loading post...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!post) return <p>Post not found.</p>;

  return (
    <article className="post-detail">
      <h1>{post.title}</h1>
      <p className="meta">
        Author ID: {post.author_id} | Created: {new Date(post.created_at).toLocaleString()} | Updated: {new Date(post.updated_at).toLocaleString()}
      </p>
      <p>{post.content}</p>
      {isAuthenticated && (
        <div className="actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => router.push(`/posts/${post.id}/edit`)}
          >
            Edit
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      )}
    </article>
  );
}
