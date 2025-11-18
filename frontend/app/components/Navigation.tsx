'use client';

import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function Navigation() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (pathname === '/login') {
    return null;
  }

  return (
    <nav className="bg-slate-800 shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="text-2xl font-bold text-white hover:text-blue-100 transition-colors">
              Blog
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link
                href="/dashboard"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === '/dashboard' 
                    ? 'bg-white/20 text-white' 
                    : 'text-white/90 hover:text-white'
                }`}
              >
                Dashboard
              </Link>
              {user?.role === 'ADMIN' && (
                <>
                  <Link
                    href="/admin"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      pathname === '/admin' 
                        ? 'bg-white/20 text-white' 
                        : 'text-white/90 hover:text-white'
                    }`}
                  >
                    Admin
                  </Link>
                  <Link
                    href="/create-post"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      pathname === '/create-post' 
                        ? 'bg-white/20 text-white' 
                        : 'text-white/90 hover:text-white'
                    }`}
                  >
                    Create Post
                  </Link>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-3">
              <span className="text-white/90 text-sm">
                {user?.email}
              </span>
              <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                {user?.role}
              </span>
            </div>
            
            <button
              onClick={handleLogout}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md backdrop-blur-sm border border-white/20"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
