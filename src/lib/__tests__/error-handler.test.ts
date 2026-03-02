import { describe, it, expect } from 'vitest'
import { handleApiError } from '../error-handler'
import { ApiError } from '../api-client'

describe('handleApiError', () => {
  it('should return a user-friendly message for DB_ERROR', () => {
    const error = new ApiError('internal technical detail', 500, 'DB_ERROR')
    expect(handleApiError(error)).toBe('Database error: internal technical detail')
  })

  it('should handle duplicate product version error specifically', () => {
    const error = new ApiError('unique_product_version violation', 500, 'DB_ERROR')
    expect(handleApiError(error)).toContain('This version already exists')
  })

  it('should handle NETWORK_ERROR', () => {
    const error = new ApiError('Failed to fetch', 500, 'NETWORK_ERROR')
    expect(handleApiError(error)).toContain('Network connection issue')
  })

  it('should fallback to standard Error message', () => {
    const error = new Error('Normal error')
    expect(handleApiError(error)).toBe('Normal error')
  })
})
