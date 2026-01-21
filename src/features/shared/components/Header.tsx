'use client'

import React from 'react';
import { Search, Bell, Command, Sun, Moon, User, Shield } from 'lucide-react';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { useTheme } from '@/features/shared/contexts/ThemeContext';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const isDark = theme === 'dark';

  // Demo user if not authenticated
  const demoUser = {
    id: 'demo_superadmin_001',
    email: 'admin@celaest.com',
    name: 'CELAEST Admin',
    role: 'super_admin' as const,
  };

  const currentUser = user || demoUser;

  const getRoleIcon = () => {
    if (currentUser?.role === 'super_admin') return <Shield className="w-3 h-3 text-purple-400" />;
    if (currentUser?.role === 'admin') return <Shield className="w-3 h-3 text-cyan-400" />;
    return <User className="w-3 h-3" />;
  };

  return (
    <header className={`h-20 px-8 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-300 ${
      isDark
        ? 'bg-black/40 border-white/5' 
        : 'bg-white/60 border-gray-200'
    }`}>
      <div className="flex items-center w-96 relative group">
        <Search className={`absolute left-4 w-5 h-5 transition-colors ${
          isDark ? 'text-gray-500 group-focus-within:text-cyan-400' : 'text-gray-400 group-focus-within:text-blue-500'
        }`} />
        <input 
          type="text" 
          placeholder="Search command or data..." 
          className={`w-full border rounded-full h-10 pl-12 pr-12 text-sm focus:outline-none focus:ring-1 transition-all ${
            isDark
              ? 'bg-black/50 border-white/10 text-white focus:border-cyan-500/50 focus:ring-cyan-500/50 placeholder:text-gray-600'
              : 'bg-gray-100 border-gray-200 text-gray-900 focus:border-blue-500/50 focus:ring-blue-500/50 placeholder:text-gray-500'
          }`}
        />
        <div className="absolute right-4 flex items-center gap-1">
            <Command className={`w-3 h-3 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
            <span className={`text-[10px] font-mono ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>K</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* User Info */}
        {currentUser && (
          <div className={`flex items-center gap-3 px-4 py-2 rounded-full border ${
            isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isDark ? 'bg-cyan-500/20' : 'bg-blue-100'
            }`}>
              {getRoleIcon()}
            </div>
            <div className="flex flex-col">
              <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {currentUser.name || currentUser.email.split('@')[0]}
              </span>
              <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                {currentUser.role.replace('_', ' ')}
              </span>
            </div>
          </div>
        )}

        <button 
          onClick={toggleTheme}
          className={`p-2 rounded-full transition-all duration-300 ${
            isDark
              ? 'text-gray-400 hover:text-yellow-400 hover:bg-white/5' 
              : 'text-gray-500 hover:text-blue-600 hover:bg-gray-100'
          }`}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <button className={`relative transition-colors ${
          isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
        }`}>
          <Bell className="w-5 h-5" />
          <span className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${
            isDark ? 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]' : 'bg-blue-600'
          }`} />
        </button>
      </div>
    </header>
  );
};