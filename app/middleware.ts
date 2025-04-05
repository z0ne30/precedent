import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define protected routes using a matcher
const isProtectedRoute = createRouteMatcher([
  '/admin(.*)',     // Matches /admin and /admin/*
  '/api/admin(.*)', // Matches /api/admin and /api/admin/*
]);

export default clerkMiddleware((auth, req) => {
  const path = req.nextUrl.pathname;
  console.log(`>>> Middleware invoked for path: ${path}`); // Log path

  // Protect the route if it matches the defined protected routes
  if (isProtectedRoute(req)) {
    console.log(`>>> Path ${path} IS protected. Calling auth().protect().`); // Log protection check
    auth().protect();
  } else {
    console.log(`>>> Path ${path} is NOT protected.`); // Log non-protection
  }
  // By default, clerkMiddleware allows the request for non-matched routes
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    // Drastically simplified matcher for testing: ONLY match /admin and API routes
    '/admin(.*)',
    '/(api|trpc)(.*)',
  ],
}