/**
 * useErrorStore — Unit Tests
 *
 * Tests the Zustand error store (filters, controls toggle).
 * Pure store tests — no React Query, no API calls.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { useErrorStore } from '../../stores/useErrorStore';

describe('useErrorStore', () => {
  beforeEach(() => {
    // Reset store to defaults before each test
    useErrorStore.setState({
      showErrorControls: false,
      errorFilters: { severity: 'all', status: 'all' },
    });
  });

  it('initializes with default filter values', () => {
    const state = useErrorStore.getState();
    expect(state.errorFilters.severity).toBe('all');
    expect(state.errorFilters.status).toBe('all');
    expect(state.showErrorControls).toBe(false);
  });

  it('setErrorFilters — updates severity filter', () => {
    const { setErrorFilters } = useErrorStore.getState();
    setErrorFilters({ severity: 'critical', status: 'all' });

    const state = useErrorStore.getState();
    expect(state.errorFilters.severity).toBe('critical');
    expect(state.errorFilters.status).toBe('all');
  });

  it('setErrorFilters — updates status filter', () => {
    const { setErrorFilters } = useErrorStore.getState();
    setErrorFilters({ severity: 'all', status: 'failed' });

    expect(useErrorStore.getState().errorFilters.status).toBe('failed');
  });

  it('setErrorFilters — updates both filters simultaneously', () => {
    const { setErrorFilters } = useErrorStore.getState();
    setErrorFilters({ severity: 'warning', status: 'resolved' });

    const state = useErrorStore.getState();
    expect(state.errorFilters.severity).toBe('warning');
    expect(state.errorFilters.status).toBe('resolved');
  });

  it('setShowErrorControls — toggles control visibility', () => {
    const { setShowErrorControls } = useErrorStore.getState();

    setShowErrorControls(true);
    expect(useErrorStore.getState().showErrorControls).toBe(true);

    setShowErrorControls(false);
    expect(useErrorStore.getState().showErrorControls).toBe(false);
  });

  it('filters are independent — setting one does not affect the other', () => {
    const { setErrorFilters } = useErrorStore.getState();

    setErrorFilters({ severity: 'critical', status: 'all' });
    setErrorFilters({ severity: 'critical', status: 'reviewing' });

    const state = useErrorStore.getState();
    expect(state.errorFilters.severity).toBe('critical');
    expect(state.errorFilters.status).toBe('reviewing');
  });
});
