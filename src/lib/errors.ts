/**
 * Custom error classes for better error handling
 */

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isOperational = true
  ) {
    super(message)
    this.name = 'ApiError'
    Object.setPrototypeOf(this, ApiError.prototype)
  }
}

export class AuthenticationError extends ApiError {
  constructor(message = 'Authentication required') {
    super(401, message)
    this.name = 'AuthenticationError'
  }
}

export class AuthorizationError extends ApiError {
  constructor(message = 'Insufficient permissions') {
    super(403, message)
    this.name = 'AuthorizationError'
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, public details?: any) {
    super(400, message)
    this.name = 'ValidationError'
  }
}

export class NotFoundError extends ApiError {
  constructor(resource: string) {
    super(404, `${resource} not found`)
    this.name = 'NotFoundError'
  }
}

export class RateLimitError extends ApiError {
  constructor(message = 'Rate limit exceeded') {
    super(429, message)
    this.name = 'RateLimitError'
  }
}

export class ExternalApiError extends ApiError {
  constructor(
    public provider: string,
    message: string,
    statusCode: number = 502
  ) {
    super(statusCode, `${provider} API error: ${message}`)
    this.name = 'ExternalApiError'
  }
}
