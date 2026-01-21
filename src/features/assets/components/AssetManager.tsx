'use client'

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Crown, User, Database, HardDrive } from 'lucide-react';
import { useTheme } from '@/features/shared/contexts/ThemeContext';
import { AssetCRUD } from './AssetCRUD';
import { AssetMetrics } from './AssetMetrics';
import { AssetCatalog } from './AssetCatalog';

export const AssetManager: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [viewMode, setViewMode] = useState<'admin' | 'customer'>('admin');

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className={`text-4xl font-bold mb-3 tracking-tight ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {viewMode === 'admin' ? 'Asset Management System' : 'Product Catalog'}
            </h1>
            <p className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {viewMode === 'admin' 
                ? 'Full CRUD control over templates, versioning, and digital asset inventory'
                : 'Browse available digital assets and templates for purchase'
              }
            </p>
          </div>

          {/* Storage Info (Admin Only) */}
          {viewMode === 'admin' && (
            <div className={`flex items-center gap-3 px-5 py-3 rounded-xl border ${
              isDark
                ? 'bg-purple-500/10 border-purple-500/20'
                : 'bg-purple-50 border-purple-200'
            }`}>
              <HardDrive size={20} className={isDark ? 'text-purple-400' : 'text-purple-600'} />
              <div>
                <p className={`text-xs font-semibold ${
                  isDark ? 'text-purple-400' : 'text-purple-700'
                }`}>
                  Storage Used
                </p>
                <p className={`text-sm font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  2.4 GB / 50 GB
                </p>
              </div>
            </div>
          )}
        </div>

        {/* View Mode Toggle */}
        <div className={`inline-flex p-1 rounded-xl border ${
          isDark ? 'bg-black/40 border-white/10' : 'bg-white border-gray-200'
        }`}>
          <button
            onClick={() => setViewMode('customer')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              viewMode === 'customer'
                ? isDark
                  ? 'bg-cyan-500/20 text-cyan-400 shadow-lg'
                  : 'bg-blue-600 text-white shadow-lg'
                : isDark
                ? 'text-gray-400 hover:text-gray-300'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <User size={16} />
            Customer View
          </button>
          <button
            onClick={() => setViewMode('admin')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              viewMode === 'admin'
                ? isDark
                  ? 'bg-purple-500/20 text-purple-400 shadow-lg'
                  : 'bg-purple-600 text-white shadow-lg'
                : isDark
                ? 'text-gray-400 hover:text-gray-300'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Crown size={16} />
            Admin CRUD
          </button>
        </div>
      </div>

      {/* Conditional Rendering */}
      {viewMode === 'admin' ? (
        <>
          {/* Admin Metrics */}
          <div className="mb-6">
            <AssetMetrics />
          </div>
          
          {/* CRUD Table */}
          <AssetCRUD />
        </>
      ) : (
        /* Customer Catalog */
        <AssetCatalog />
      )}
    </div>
  );
};
