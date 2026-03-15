export interface Post {
  id: number;
  title: string;
  content: string;
  author_id: number;
  created_at: string;
  updated_at: string;
}

interface RequestOptions {
  path: string;
  method?: string;
  body?: any;
  auth?: boolean;
}

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export async function request<T>({
  path,
  method = 'GET',
  body,
  auth = false,
}: RequestOptions): Promise<T> {
  const headers: Record<string, string> = {};

  let finalBody: BodyInit | undefined;

  if (body !== undefined && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    finalBody = JSON.stringify(body);
  } else if (body instanceof FormData) {
    finalBody = body;
  }

  if (auth && typeof window !== 'undefined') {
    const token = localStorage.getItem('blog_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: finalBody,
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const message = (data && (data.detail || data.message)) || res.statusText;
    throw new ApiError(res.status, message);
  }

  return data as T;
}

export async function signup(email: string, password: string) {
  return request<{ id: number; email: string; created_at: string }>({
    path: '/auth/signup',
    method: 'POST',
    body: { email, password },
  });
}

export async function login(email: string, password: string) {
  const form = new URLSearchParams();
  form.set('username', email);
  form.set('password', password);

  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: form.toString(),
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const message = (data && (data.detail || data.message)) || res.statusText;
    throw new ApiError(res.status, message);
  }

  return data as { access_token: string; token_type: string };
}

export async function getPosts(): Promise<Post[]> {
  return request<Post[]>({ path: '/posts/?skip=0&limit=20' });
}

export async function getPost(id: number): Promise<Post> {
  return request<Post>({ path: `/posts/${id}` });
}

export async function createPost(input: {
  title: string;
  content: string;
}): Promise<Post> {
  return request<Post>({
    path: '/posts/',
    method: 'POST',
    body: input,
    auth: true,
  });
}

export async function updatePost(
  id: number,
  input: { title?: string; content?: string }
): Promise<Post> {
  return request<Post>({
    path: `/posts/${id}`,
    method: 'PUT',
    body: input,
    auth: true,
  });
}

export async function deletePost(id: number): Promise<void> {
  await request<void>({
    path: `/posts/${id}`,
    method: 'DELETE',
    auth: true,
  });
}
