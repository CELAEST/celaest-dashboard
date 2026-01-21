'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  CheckCircle2,
  Filter,
  Search,
  Download,
  Bell,
  Clock,
  Code,
  Smartphone,
  Monitor,
  X,
  ChevronDown,
  ChevronUp,
  Activity,
  TrendingDown,
  Terminal
} from 'lucide-react';
import { useTheme } from '@/features/shared/contexts/ThemeContext';
import { useAuth } from '@/features/auth/contexts/AuthContext';

type ErrorSeverity = 'critical' | 'warning' | 'info';
type ErrorStatus = 'new' | 'reviewing' | 'resolved' | 'ignored';

interface ErrorLog {
  id: string;
  timestamp: string;
  severity: ErrorSeverity;
  status: ErrorStatus;
  errorCode: string;
  message: string;
  template: string;
  version: string;
  affectedUsers: number;
  environment: {
    os: string;
    excelVersion?: string;
    platform: string;
  };
  stackTrace?: string;
  suggestion?: string;
}

const ErrorMonitoring: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const isDark = theme === 'dark';
  const [selectedSeverity, setSelectedSeverity] = useState<ErrorSeverity | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<ErrorStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedError, setExpandedError] = useState<string | null>(null);

  const isAdmin = user?.role === 'super_admin' || !user;

  // Mock error data
  const errorLogs: ErrorLog[] = [
    {
      id: 'ERR-001',
      timestamp: '2025-01-20 14:23:15',
      severity: 'critical',
      status: 'new',
      errorCode: 'ERR-502-AUTH',
      message: 'Authentication token expired during macro execution',
      template: 'Excel Automation Pro v3.2.1',
      version: '3.2.1',
      affectedUsers: 47,
      environment: {
        os: 'Windows 11',
        excelVersion: 'Office 365 (16.0.14332)',
        platform: 'Desktop'
      },
      stackTrace: 'AuthService.validateToken() at line 142\nMacroExecutor.run() at line 89\nMain.init() at line 34',
      suggestion: 'Implementar refresh token automático antes de expiration'
    },
    {
      id: 'ERR-002',
      timestamp: '2025-01-20 13:45:32',
      severity: 'warning',
      status: 'reviewing',
      errorCode: 'ERR-304-CONN',
      message: 'Slow API response detected (timeout: 8.5s)',
      template: 'PDF Generator Elite v2.1.0',
      version: '2.1.0',
      affectedUsers: 12,
      environment: {
        os: 'macOS 14.2',
        platform: 'Desktop'
      },
      suggestion: 'Revisar latencia del servidor o implementar retry logic'
    },
    {
      id: 'ERR-003',
      timestamp: '2025-01-20 12:18:47',
      severity: 'info',
      status: 'resolved',
      errorCode: 'ERR-200-INFO',
      message: 'Template updated successfully but cache not cleared',
      template: 'Data Analyzer Plus v1.8.3',
      version: '1.8.3',
      affectedUsers: 3,
      environment: {
        os: 'Windows 10',
        excelVersion: 'Office 2019',
        platform: 'Desktop'
      },
      suggestion: 'Cache limpiado manualmente - considerar auto-clear'
    },
    {
      id: 'ERR-004',
      timestamp: '2025-01-20 11:32:19',
      severity: 'critical',
      status: 'reviewing',
      errorCode: 'ERR-503-CRASH',
      message: 'Excel crashed during data import (large dataset >100k rows)',
      template: 'Excel Automation Pro v3.2.1',
      version: '3.2.1',
      affectedUsers: 8,
      environment: {
        os: 'Windows 10',
        excelVersion: 'Office 2016 (16.0.4266)',
        platform: 'Desktop'
      },
      stackTrace: 'DataImporter.processLargeFile() at line 267\nExcelAPI.insertRows() at line 445',
      suggestion: 'Implementar chunking para datasets grandes (ej: 10k rows por batch)'
    },
    {
      id: 'ERR-005',
      timestamp: '2025-01-20 10:15:03',
      severity: 'warning',
      status: 'new',
      errorCode: 'ERR-401-PERM',
      message: 'User lacks file write permissions in target directory',
      template: 'Report Builder v1.5.2',
      version: '1.5.2',
      affectedUsers: 5,
      environment: {
        os: 'Windows 11',
        platform: 'Desktop'
      },
      suggestion: 'Mostrar dialog para seleccionar directorio con permisos'
    },
  ];

  const filteredErrors = errorLogs.filter(error => {
    const matchesSeverity = selectedSeverity === 'all' || error.severity === selectedSeverity;
    const matchesStatus = selectedStatus === 'all' || error.status === selectedStatus;
    const matchesSearch = error.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         error.errorCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesStatus && matchesSearch;
  });

  const getSeverityColor = (severity: ErrorSeverity) => {
    switch (severity) {
      case 'critical':
        return 'red';
      case 'warning':
        return 'orange';
      case 'info':
        return isDark ? 'cyan' : 'blue';
    }
  };

  const getSeverityIcon = (severity: ErrorSeverity) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle size={16} />;
      case 'warning':
        return <AlertCircle size={16} />;
      case 'info':
        return <Info size={16} />;
    }
  };

  const getStatusBadge = (status: ErrorStatus) => {
    const colors = {
      new: isDark ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-red-50 text-red-600 border-red-200',
      reviewing: isDark ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' : 'bg-orange-50 text-orange-600 border-orange-200',
      resolved: isDark ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-green-50 text-green-600 border-green-200',
      ignored: isDark ? 'bg-gray-500/20 text-gray-400 border-gray-500/30' : 'bg-gray-100 text-gray-600 border-gray-200',
    };

    const labels = {
      new: 'Nuevo',
      reviewing: 'En Revisión',
      resolved: 'Resuelto',
      ignored: 'Ignorado',
    };

    return (
      <span className={`px-2 py-1 rounded-md text-xs font-medium border ${colors[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const handleStatusChange = (errorId: string, newStatus: ErrorStatus) => {
    console.log(`Changing error ${errorId} to status: ${newStatus}`);
    // In real implementation, this would update the backend
  };

  // Stats calculation
  const criticalCount = errorLogs.filter(e => e.severity === 'critical').length;
  const warningCount = errorLogs.filter(e => e.severity === 'warning').length;
  const resolvedCount = errorLogs.filter(e => e.status === 'resolved').length;
  const totalAffectedUsers = errorLogs.reduce((sum, e) => sum + e.affectedUsers, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-end mb-6"
      >
        <div>
          <h1 className={`text-3xl font-bold mb-2 tracking-tight ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Error Monitoring System
          </h1>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
            {isAdmin 
              ? 'Sistema de alerta temprana • Detección proactiva de fallos críticos' 
              : 'Tu historial de errores reportados automáticamente'
            }
          </p>
        </div>
        
        <div className="flex gap-3">
          <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 border ${
            isDark 
              ? 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border-cyan-500/30 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)]' 
              : 'bg-white hover:bg-gray-50 text-blue-600 border-gray-200 shadow-sm'
          }`}>
            <Bell size={16} />
            Configurar Alertas
          </button>
          
          <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 border ${
            isDark 
              ? 'bg-white/5 hover:bg-white/10 text-white border-white/10' 
              : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200 shadow-sm'
          }`}>
            <Download size={16} />
            Exportar Logs
          </button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`backdrop-blur-xl border rounded-2xl p-6 ${
            isDark ? 'bg-[#0a0a0a]/60 border-white/5' : 'bg-white border-gray-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isDark ? 'bg-red-500/20' : 'bg-red-50'
            }`}>
              <AlertTriangle size={20} className="text-red-400" />
            </div>
            <span className="text-xs font-medium text-red-400">CRÍTICO</span>
          </div>
          <p className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {criticalCount}
          </p>
          <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            Requieren atención inmediata
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`backdrop-blur-xl border rounded-2xl p-6 ${
            isDark ? 'bg-[#0a0a0a]/60 border-white/5' : 'bg-white border-gray-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isDark ? 'bg-orange-500/20' : 'bg-orange-50'
            }`}>
              <AlertCircle size={20} className="text-orange-400" />
            </div>
            <span className="text-xs font-medium text-orange-400">WARNING</span>
          </div>
          <p className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {warningCount}
          </p>
          <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            Problemas de rendimiento
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`backdrop-blur-xl border rounded-2xl p-6 ${
            isDark ? 'bg-[#0a0a0a]/60 border-white/5' : 'bg-white border-gray-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isDark ? 'bg-green-500/20' : 'bg-green-50'
            }`}>
              <CheckCircle2 size={20} className="text-green-400" />
            </div>
            <span className="text-xs font-medium text-green-400">RESUELTO</span>
          </div>
          <p className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {resolvedCount}
          </p>
          <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            Corregidos este mes
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`backdrop-blur-xl border rounded-2xl p-6 ${
            isDark ? 'bg-[#0a0a0a]/60 border-white/5' : 'bg-white border-gray-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isDark ? 'bg-cyan-500/20' : 'bg-blue-50'
            }`}>
              <Activity size={20} className={isDark ? 'text-cyan-400' : 'text-blue-600'} />
            </div>
            <span className={`text-xs font-medium ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}>IMPACTO</span>
          </div>
          <p className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {totalAffectedUsers}
          </p>
          <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            Usuarios afectados total
          </p>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className={`backdrop-blur-xl border rounded-2xl p-4 ${
          isDark ? 'bg-[#0a0a0a]/60 border-white/5' : 'bg-white border-gray-200 shadow-sm'
        }`}
      >
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter size={16} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
            <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Filtros:
            </span>
          </div>

          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value as ErrorSeverity | 'all')}
            className={`px-3 py-1.5 rounded-lg text-sm border ${
              isDark 
                ? 'bg-black/40 border-cyan-500/30 text-cyan-400' 
                : 'bg-gray-50 border-gray-200 text-gray-700'
            }`}
          >
            <option value="all">Todas las Severidades</option>
            <option value="critical">Crítico</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as ErrorStatus | 'all')}
            className={`px-3 py-1.5 rounded-lg text-sm border ${
              isDark 
                ? 'bg-black/40 border-cyan-500/30 text-cyan-400' 
                : 'bg-gray-50 border-gray-200 text-gray-700'
            }`}
          >
            <option value="all">Todos los Estados</option>
            <option value="new">Nuevo</option>
            <option value="reviewing">En Revisión</option>
            <option value="resolved">Resuelto</option>
            <option value="ignored">Ignorado</option>
          </select>

          <div className="flex-1 min-w-[200px] max-w-[400px] relative">
            <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${
              isDark ? 'text-gray-500' : 'text-gray-400'
            }`} />
            <input
              type="text"
              placeholder="Buscar por código o mensaje..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-1.5 rounded-lg text-sm border ${
                isDark 
                  ? 'bg-black/40 border-cyan-500/30 text-white placeholder-gray-500' 
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
              }`}
            />
          </div>

          <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            {filteredErrors.length} resultado{filteredErrors.length !== 1 ? 's' : ''}
          </span>
        </div>
      </motion.div>

      {/* Error Logs List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredErrors.map((error, index) => (
            <motion.div
              key={error.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              className={`backdrop-blur-xl border rounded-2xl overflow-hidden ${
                isDark ? 'bg-[#0a0a0a]/60 border-white/5' : 'bg-white border-gray-200 shadow-sm'
              }`}
            >
              {/* Error Header */}
              <div 
                className={`p-6 cursor-pointer hover:bg-white/5 transition-colors ${
                  expandedError === error.id ? (isDark ? 'bg-white/5' : 'bg-gray-50') : ''
                }`}
                onClick={() => setExpandedError(expandedError === error.id ? null : error.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      error.severity === 'critical' 
                        ? isDark ? 'bg-red-500/20' : 'bg-red-50'
                        : error.severity === 'warning'
                          ? isDark ? 'bg-orange-500/20' : 'bg-orange-50'
                          : isDark ? 'bg-cyan-500/20' : 'bg-blue-50'
                    }`}>
                      <span className={`text-${getSeverityColor(error.severity)}-400`}>
                        {getSeverityIcon(error.severity)}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`font-mono text-sm font-bold ${
                          isDark ? 'text-cyan-400' : 'text-blue-600'
                        }`}>
                          {error.errorCode}
                        </span>
                        {getStatusBadge(error.status)}
                        <span className={`flex items-center gap-1 text-xs ${
                          isDark ? 'text-gray-500' : 'text-gray-500'
                        }`}>
                          <Clock size={12} />
                          {error.timestamp}
                        </span>
                      </div>
                      
                      <p className={`font-medium mb-2 ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {error.message}
                      </p>

                      <div className="flex items-center gap-4 text-xs">
                        <span className={`flex items-center gap-1 ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          <Code size={12} />
                          {error.template}
                        </span>
                        <span className={`flex items-center gap-1 ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          <Monitor size={12} />
                          {error.environment.os}
                        </span>
                        {isAdmin && (
                          <span className={`flex items-center gap-1 font-medium ${
                            error.affectedUsers > 20 ? 'text-red-400' : isDark ? 'text-cyan-400' : 'text-blue-600'
                          }`}>
                            <TrendingDown size={12} />
                            {error.affectedUsers} usuarios afectados
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button className={`p-2 rounded-lg transition-colors ${
                    isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                  }`}>
                    {expandedError === error.id ? (
                      <ChevronUp size={20} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                    ) : (
                      <ChevronDown size={20} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              <AnimatePresence>
                {expandedError === error.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`border-t overflow-hidden ${
                      isDark ? 'border-white/5' : 'border-gray-200'
                    }`}
                  >
                    <div className="p-6 space-y-4">
                      {/* Environment Details */}
                      <div>
                        <h4 className={`text-sm font-semibold mb-2 flex items-center gap-2 ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                          <Smartphone size={14} />
                          Entorno del Cliente
                        </h4>
                        <div className={`p-3 rounded-lg ${
                          isDark ? 'bg-white/5' : 'bg-gray-50'
                        }`}>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className={`block text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                Sistema Operativo
                              </span>
                              <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                                {error.environment.os}
                              </span>
                            </div>
                            {error.environment.excelVersion && (
                              <div>
                                <span className={`block text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                  Versión de Excel
                                </span>
                                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                                  {error.environment.excelVersion}
                                </span>
                              </div>
                            )}
                            <div>
                              <span className={`block text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                Plataforma
                              </span>
                              <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                                {error.environment.platform}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Stack Trace (Admin Only) */}
                      {isAdmin && error.stackTrace && (
                        <div>
                          <h4 className={`text-sm font-semibold mb-2 flex items-center gap-2 ${
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}>
                            <Terminal size={14} />
                            Stack Trace
                          </h4>
                          <div className={`p-3 rounded-lg font-mono text-xs overflow-x-auto ${
                            isDark ? 'bg-black/40 text-cyan-400' : 'bg-gray-900 text-cyan-300'
                          }`}>
                            <pre className="whitespace-pre-wrap">{error.stackTrace}</pre>
                          </div>
                        </div>
                      )}

                      {/* Suggestion */}
                      {error.suggestion && (
                        <div className={`p-4 rounded-lg border ${
                          isDark 
                            ? 'bg-cyan-500/5 border-cyan-500/20' 
                            : 'bg-blue-50 border-blue-200'
                        }`}>
                          <h4 className={`text-sm font-semibold mb-1 ${
                            isDark ? 'text-cyan-400' : 'text-blue-600'
                          }`}>
                            💡 Sugerencia de Solución
                          </h4>
                          <p className={`text-sm ${
                            isDark ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            {error.suggestion}
                          </p>
                        </div>
                      )}

                      {/* Client View - Simple Message */}
                      {!isAdmin && (
                        <div className={`p-4 rounded-lg border ${
                          isDark 
                            ? 'bg-cyan-500/5 border-cyan-500/20' 
                            : 'bg-blue-50 border-blue-200'
                        }`}>
                          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            ✅ Este error ha sido reportado automáticamente a nuestro equipo técnico. 
                            No es necesario que reportes nada adicional.
                          </p>
                        </div>
                      )}

                      {/* Actions (Admin Only) */}
                      {isAdmin && (
                        <div className="flex gap-3 pt-2">
                          <button
                            onClick={() => handleStatusChange(error.id, 'reviewing')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                              isDark 
                                ? 'bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border-orange-500/30' 
                                : 'bg-orange-50 hover:bg-orange-100 text-orange-600 border-orange-200'
                            }`}
                          >
                            Marcar En Revisión
                          </button>
                          <button
                            onClick={() => handleStatusChange(error.id, 'resolved')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                              isDark 
                                ? 'bg-green-500/10 hover:bg-green-500/20 text-green-400 border-green-500/30' 
                                : 'bg-green-50 hover:bg-green-100 text-green-600 border-green-200'
                            }`}
                          >
                            Marcar Resuelto
                          </button>
                          <button
                            onClick={() => handleStatusChange(error.id, 'ignored')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                              isDark 
                                ? 'bg-gray-500/10 hover:bg-gray-500/20 text-gray-400 border-gray-500/30' 
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-600 border-gray-300'
                            }`}
                          >
                            Ignorar
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredErrors.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`backdrop-blur-xl border rounded-2xl p-12 text-center ${
              isDark ? 'bg-[#0a0a0a]/60 border-white/5' : 'bg-white border-gray-200 shadow-sm'
            }`}
          >
            <CheckCircle2 size={48} className={`mx-auto mb-4 ${
              isDark ? 'text-cyan-400' : 'text-blue-600'
            }`} />
            <h3 className={`text-xl font-bold mb-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              No hay errores que coincidan con los filtros
            </h3>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Intenta ajustar los filtros o búsqueda
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ErrorMonitoring;
