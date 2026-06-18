export { default } from 'next-auth/middleware'

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api-keys',
    '/api/dashboard/:path*',
    '/api/api-keys/:path*',
  ],
}
