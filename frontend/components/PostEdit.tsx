"use client";

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getPost, updatePost, Post } from '../lib/api';
import { useAuth } from '../context/AuthContext';

interface Props {
  id: number;
}

export default function PostEdit({ id }: Props) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    const fetchPost = async () => {
      try {
        const data = await getPost(id);
        setPost(data);
        setTitle(data.title);
        setContent(data.content);
      } catch (err: any) {
        setError(err.message || 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, isAuthenticated, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!post) return;
    setSaving(true);
    setError(null);

    try {
      await updatePost(post.id, { title, content });
      router.push(`/posts/${post.id}`);
    } catch (err: any) {
      if (err.status === 403) {
        setError('You are not allowed to edit this post.');
      } else if (err.status === 404) {
        setError('Post not found.');
      } else {
        setError(err.message || 'Failed to update post');
      }
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) return null;
  if (loading) return <p>Loading post...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!post) return <p>Post not found.</p>;

  return (
    <section>
      <h1>Edit Post</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </section>
  );
}
