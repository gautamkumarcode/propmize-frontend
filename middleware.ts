import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Protected routes that require authentication
const protectedRoutes = [
	"/profile",
	"/saved",
	"/recent",
	"/contacted",
	"/switch-mode",
	"/seller",
	"/seller/add-property",
	"/seller/analytics",
	"/seller/leads",
	"/seller/plans",
	"/seller/premium",
	"/seller/profile",
	"/seller/guide",
	"/seller/support",
];

// Public routes that don't require authentication
const publicRoutes = ["/", "/guide", "/support", "/new-projects"];

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Check if the user is authenticated (you might want to check cookies/tokens here)
	const isAuthenticated =
		request.cookies.has("auth-token") ||
		request.cookies.has("next-auth.session-token");

	// Allow access to public routes
	if (publicRoutes.includes(pathname)) {
		return NextResponse.next();
	}

	// Check if the route is protected
	const isProtectedRoute = protectedRoutes.some(
		(route) => pathname === route || pathname.startsWith(route + "/")
	);

	// Redirect to login/home if trying to access protected route without authentication
	if (isProtectedRoute && !isAuthenticated) {
		const url = request.nextUrl.clone();
		url.pathname = "/";
		url.searchParams.set("redirect", pathname);
		return NextResponse.redirect(url);
	}

	return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico).*)",
	],
};
