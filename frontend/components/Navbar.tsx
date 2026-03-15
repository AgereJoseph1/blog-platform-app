"use client";

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="navbar">
      <nav className="nav-inner">
        <Link href="/" className="logo">Blog Platform</Link>
        <div className="nav-links">
          <Link href="/">Home</Link>
          {isAuthenticated && <Link href="/dashboard">Dashboard</Link>}
          {!isAuthenticated && <Link href="/login">Login</Link>}
          {!isAuthenticated && <Link href="/signup">Signup</Link>}
          {isAuthenticated && (
            <button type="button" onClick={handleLogout} className="btn btn-secondary">
              Logout
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
