'use client'

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FileSpreadsheet, Code, Globe, Lock, Star, Download, ChevronRight } from 'lucide-react';
import { useTheme } from '@/features/shared/contexts/ThemeContext';
import { ProductDetailModal } from './ProductDetailModal';

interface Product {
  id: string;
  name: string;
  type: 'excel' | 'script' | 'google-sheet';
  category: string;
  price: number;
  rating: number;
  reviews: number;
  downloads: number;
  description: string;
  features: string[];
  requirements: string[];
  thumbnail: string;
  isPurchased: boolean;
}

export const AssetCatalog: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filter, setFilter] = useState<'all' | 'excel' | 'script' | 'google-sheet'>('all');

  const products: Product[] = [
    {
      id: '1',
      name: 'Advanced Financial Dashboard',
      type: 'excel',
      category: 'Finance',
      price: 149.99,
      rating: 4.8,
      reviews: 127,
      downloads: 342,
      description: 'Comprehensive financial analysis tool with automated reporting, P&L statements, and cash flow forecasting.',
      features: [
        'Automated financial reports',
        'Interactive dashboards',
        'Multi-currency support',
        'Budget vs Actual analysis',
      ],
      requirements: [
        'Microsoft Excel 2016 or higher',
        'Windows 10+ or macOS 10.14+',
        'Macros enabled',
      ],
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
      isPurchased: false,
    },
    {
      id: '2',
      name: 'Python Data Scraper Script',
      type: 'script',
      category: 'Automation',
      price: 89.99,
      rating: 4.9,
      reviews: 89,
      downloads: 567,
      description: 'Powerful web scraping tool with anti-bot detection, proxy support, and automatic data cleaning.',
      features: [
        'Multi-threaded scraping',
        'Proxy rotation',
        'Data export to CSV/JSON',
        'Customizable selectors',
      ],
      requirements: [
        'Python 3.8 or higher',
        'pip package manager',
        'Chrome or Firefox browser',
      ],
      thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400',
      isPurchased: true,
    },
    {
      id: '3',
      name: 'Inventory Management Template',
      type: 'google-sheet',
      category: 'Operations',
      price: 59.99,
      rating: 4.7,
      reviews: 203,
      downloads: 891,
      description: 'Complete inventory tracking system with real-time stock alerts, supplier management, and purchase order automation.',
      features: [
        'Real-time stock tracking',
        'Automated reorder alerts',
        'Supplier database',
        'Mobile-friendly interface',
      ],
      requirements: [
        'Google Account',
        'Google Sheets access',
        'Internet connection',
      ],
      thumbnail: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400',
      isPurchased: false,
    },
    {
      id: '4',
      name: 'CRM Analytics Bundle',
      type: 'excel',
      category: 'Sales',
      price: 199.99,
      rating: 4.6,
      reviews: 54,
      downloads: 189,
      description: 'Professional CRM analytics suite with customer segmentation, sales pipeline tracking, and performance metrics.',
      features: [
        'Customer segmentation',
        'Sales funnel visualization',
        'Revenue forecasting',
        'Team performance tracking',
      ],
      requirements: [
        'Microsoft Excel 2019 or higher',
        'Windows 10+ or macOS 11+',
        'VBA macros enabled',
      ],
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
      isPurchased: false,
    },
  ];

  const filteredProducts = filter === 'all' 
    ? products 
    : products.filter(p => p.type === filter);

  const getTypeIcon = (type: Product['type']) => {
    switch (type) {
      case 'excel':
        return <FileSpreadsheet size={20} className="text-emerald-500" />;
      case 'script':
        return <Code size={20} className="text-blue-500" />;
      case 'google-sheet':
        return <Globe size={20} className="text-orange-500" />;
    }
  };

  const getTypeLabel = (type: Product['type']) => {
    switch (type) {
      case 'excel':
        return 'Excel Macro';
      case 'script':
        return 'Script/Code';
      case 'google-sheet':
        return 'Google Sheet';
    }
  };

  return (
    <>
      {/* Filter Tabs */}
      <div className="mb-6 flex items-center gap-3">
        {[
          { value: 'all', label: 'All Products' },
          { value: 'excel', label: 'Excel', icon: FileSpreadsheet },
          { value: 'script', label: 'Scripts', icon: Code },
          { value: 'google-sheet', label: 'Google Sheets', icon: Globe },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = filter === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                isActive
                  ? isDark
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                    : 'bg-blue-600 text-white shadow-sm'
                  : isDark
                  ? 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {Icon && <Icon size={16} />}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`group rounded-2xl border overflow-hidden transition-all hover:shadow-xl ${
              isDark
                ? 'bg-gradient-to-br from-[#0a0a0a]/80 to-gray-900/50 border-white/10 hover:border-cyan-500/30'
                : 'bg-white border-gray-200 hover:border-blue-300 shadow-sm'
            }`}
          >
            {/* Thumbnail */}
            <div className="relative h-48 overflow-hidden">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundImage: `url(${product.thumbnail})` }}
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${
                isDark ? 'from-black/80 to-transparent' : 'from-black/60 to-transparent'
              }`} />
              
              {/* Type Badge */}
              <div className="absolute top-4 left-4">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg backdrop-blur-md ${
                  isDark ? 'bg-black/60 border border-white/20' : 'bg-white/90 border border-gray-200'
                }`}>
                  {getTypeIcon(product.type)}
                  <span className={`text-xs font-semibold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {getTypeLabel(product.type)}
                  </span>
                </div>
              </div>

              {/* Purchased Badge */}
              {product.isPurchased && (
                <div className="absolute top-4 right-4">
                  <div className={`px-3 py-1.5 rounded-lg backdrop-blur-md ${
                    isDark
                      ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
                      : 'bg-emerald-500/90 border border-emerald-600 text-white'
                  }`}>
                    <span className="text-xs font-bold">OWNED</span>
                  </div>
                </div>
              )}

              {/* Price */}
              <div className="absolute bottom-4 left-4">
                <div className={`text-3xl font-bold ${
                  isDark ? 'text-white' : 'text-white'
                }`}>
                  ${product.price}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-3">
                <h3 className={`text-lg font-bold mb-1 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {product.name}
                </h3>
                <p className={`text-xs ${
                  isDark ? 'text-gray-500' : 'text-gray-600'
                }`}>
                  {product.category}
                </p>
              </div>

              <p className={`text-sm mb-4 line-clamp-2 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {product.description}
              </p>

              {/* Stats */}
              <div className="flex items-center gap-4 mb-4 pb-4 border-b border-white/5">
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-yellow-500 fill-yellow-500" />
                  <span className={`text-sm font-semibold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {product.rating}
                  </span>
                  <span className={`text-xs ${
                    isDark ? 'text-gray-500' : 'text-gray-600'
                  }`}>
                    ({product.reviews})
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Download size={14} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
                  <span className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {product.downloads}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setSelectedProduct(product)}
                disabled={!product.isPurchased && false} // Simulate locked state
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                  product.isPurchased
                    ? isDark
                      ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                    : isDark
                    ? 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/20'
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                }`}
              >
                {product.isPurchased ? (
                  <>
                    View Details
                    <ChevronRight size={16} />
                  </>
                ) : (
                  <>
                    View Details
                    <Lock size={14} />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
};
