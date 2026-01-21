'use client'

// Initial Setup Component - Create First Super Admin
import React, { useState } from 'react';
import { useTheme } from '@/features/shared/contexts/ThemeContext';
import { motion } from 'motion/react';
import { Shield, AlertCircle, CheckCircle2, Lock, Mail, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const projectId = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID || 'your-project-id';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-619c2234`;

export const InitialSetup: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleCreateSuperAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          password, 
          name,
          role: 'super_admin' 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create Super Admin');
      } else {
        setSuccess(true);
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Failed to create Super Admin');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={`min-h-screen flex items-center justify-center font-sans ${
        isDark ? 'bg-[#08080A]' : 'bg-[#F5F7FA]'
      }`}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="max-w-md"
        >
          <Card className={`${isDark ? 'bg-[#0a0a0a]/80 border-green-500/30' : 'bg-white border-green-300'}`}>
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  isDark ? 'bg-green-500/20' : 'bg-green-100'
                }`}>
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <CardTitle className={`text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Super Admin Created!
              </CardTitle>
              <CardDescription className="text-center">
                Your account has been created successfully. Refresh the page to sign in.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => window.location.reload()}
                className={`w-full ${
                  isDark ? 'bg-cyan-500 hover:bg-cyan-600' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                Refresh & Sign In
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center font-sans ${
      isDark ? 'bg-[#08080A]' : 'bg-[#F5F7FA]'
    }`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full mx-4"
      >
        <Card className={`${isDark ? 'bg-[#0a0a0a]/80 border-white/10' : 'bg-white border-gray-200'}`}>
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                isDark ? 'bg-purple-500/20 border border-purple-500/30' : 'bg-purple-100'
              }`}>
                <Shield className="w-8 h-8 text-purple-500" />
              </div>
            </div>
            <CardTitle className={`text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Initial Setup
            </CardTitle>
            <CardDescription className="text-center">
              Create the first Super Admin account for CELAEST
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className={`mb-4 border ${isDark ? 'border-red-500/30 bg-red-500/10' : 'border-red-300 bg-red-50'}`}>
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertDescription className={isDark ? 'text-red-400' : 'text-red-700'}>
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleCreateSuperAdmin} className="space-y-4">
              <div>
                <Label htmlFor="name" className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                  Full Name
                </Label>
                <div className="relative mt-1">
                  <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                    isDark ? 'text-gray-500' : 'text-gray-400'
                  }`} />
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                    className={`pl-10 ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-300'}`}
                    placeholder="Admin Name"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                  Email Address
                </Label>
                <div className="relative mt-1">
                  <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                    isDark ? 'text-gray-500' : 'text-gray-400'
                  }`} />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    className={`pl-10 ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-300'}`}
                    placeholder="admin@celaest.com"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                  Password
                </Label>
                <div className="relative mt-1">
                  <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                    isDark ? 'text-gray-500' : 'text-gray-400'
                  }`} />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    className={`pl-10 ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-300'}`}
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <Alert className={`border ${isDark ? 'border-purple-500/30 bg-purple-500/10' : 'border-purple-300 bg-purple-50'}`}>
                <Shield className="h-4 w-4 text-purple-500" />
                <AlertDescription className={isDark ? 'text-purple-300' : 'text-purple-700'}>
                  This account will have full system access including user management.
                </AlertDescription>
              </Alert>

              <Button
                type="submit"
                disabled={loading}
                className={`w-full ${
                  isDark 
                    ? 'bg-purple-500 hover:bg-purple-600 text-white' 
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  'Create Super Admin'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
