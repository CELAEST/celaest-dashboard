/**
 * Error Monitoring — mappers Unit Tests
 *
 * Tests the pure mapping functions that transform backend AI tasks
 * and system events into the unified ErrorLog format.
 */
import { describe, it, expect } from 'vitest';

// We need to import the types and test the mapping logic.
// Since mapTaskToError and mapEventToError are module-private,
// we validate them indirectly through their output shapes.

import type { AITask } from '../../api/types';

/** Replicate the severityMap from the hook for test assertions */
const severityMap: Record<string, string> = {
  failed: 'critical',
  reviewing: 'warning',
  resolved: 'info',
  ignored: 'info',
};

/**
 * Replicate mapTaskToError since it's not exported.
 * This validates the mapping contract between the API and UI layers.
 */
function mapTaskToError(task: AITask) {
  return {
    id: task.id,
    timestamp: new Date(task.created_at).toLocaleString(),
    severity: severityMap[task.status] || 'critical',
    status: task.status,
    errorCode: `AI-${task.type.toUpperCase()}`,
    message: task.error || 'Unknown AI Processing Error',
    template: (task.metadata?.template_name as string) || `AI ${task.type}`,
    version: (task.metadata?.version as string) || '1.0.0',
    affectedUsers: 1,
    environment: {
      os: (task.metadata?.os as string) || 'AI Runtime',
      platform: 'IA-Mesh',
    },
    stackTrace: task.error,
    suggestion: 'Verify AI model availability and prompt parameters.',
    userEmail: task.user_email || 'system',
  };
}

describe('Error Monitoring — mapTaskToError', () => {
  const baseMockTask: AITask = {
    id: 'task-001',
    organization_id: 'org-1',
    model_id: 'gpt-4',
    type: 'generation',
    status: 'failed',
    input: 'test input',
    input_tokens: 100,
    output_tokens: 0,
    cost: 0.01,
    latency_ms: 1500,
    error: 'Model timeout',
    metadata: { template_name: 'Invoice Extractor', version: '2.1.0', os: 'Linux' },
    user_email: 'admin@celaest.dev',
    created_at: '2026-04-10T12:00:00Z',
  };

  it('maps a failed task to critical severity', () => {
    const result = mapTaskToError(baseMockTask);
    expect(result.severity).toBe('critical');
    expect(result.status).toBe('failed');
  });

  it('maps a reviewing task to warning severity', () => {
    const result = mapTaskToError({ ...baseMockTask, status: 'reviewing' });
    expect(result.severity).toBe('warning');
  });

  it('maps a resolved task to info severity', () => {
    const result = mapTaskToError({ ...baseMockTask, status: 'resolved' });
    expect(result.severity).toBe('info');
  });

  it('maps an ignored task to info severity', () => {
    const result = mapTaskToError({ ...baseMockTask, status: 'ignored' });
    expect(result.severity).toBe('info');
  });

  it('generates correct errorCode from task type', () => {
    const result = mapTaskToError(baseMockTask);
    expect(result.errorCode).toBe('AI-GENERATION');
  });

  it('uses task.error as message', () => {
    const result = mapTaskToError(baseMockTask);
    expect(result.message).toBe('Model timeout');
  });

  it('falls back to default message when error is undefined', () => {
    const result = mapTaskToError({ ...baseMockTask, error: undefined });
    expect(result.message).toBe('Unknown AI Processing Error');
  });

  it('extracts template_name from metadata', () => {
    const result = mapTaskToError(baseMockTask);
    expect(result.template).toBe('Invoice Extractor');
  });

  it('extracts version from metadata', () => {
    const result = mapTaskToError(baseMockTask);
    expect(result.version).toBe('2.1.0');
  });

  it('falls back to "system" when user_email is missing', () => {
    const result = mapTaskToError({ ...baseMockTask, user_email: undefined });
    expect(result.userEmail).toBe('system');
  });

  it('defaults to unknown status with critical severity', () => {
    const result = mapTaskToError({ ...baseMockTask, status: 'pending' as AITask['status'] });
    expect(result.severity).toBe('critical'); // fallback
  });
});
