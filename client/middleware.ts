import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function verifyToken(accessToken: any) {
  try {
    const response = await fetch(`${API_URL}/users/verify-token`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.isValid;
    }

    return false;
  } catch (error) {
    console.error("middleware: Error verifying token", error);
    return false;
  }
}

async function refresh(refreshToken: any) {
  try {
    const response = await fetch(`${API_URL}/users/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.newAccessToken; // Retornar el nuevo token de acceso
    }

    return null; // Retornar null si hay un error
  } catch (error) {
    console.error("middleware: Error refreshing token", error);
    return null;
  }
}

async function verifyAdmin(accessToken: string) {
  try {
    const response = await fetch(`${API_URL}/users/isadmin`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      const role = await response.text();
      return role.includes("Admin");
    }

    return false;
  } catch (error) {
    console.error("Error verifying admin role:", error);
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const publicRoutes = [
    "/password-recovery",
    "/password-reset",
    "/sign-in",
    "/sign-up",
  ];
  const protectedRoutes = ["/profile", "/settings", "/dashboard"];

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    if (accessToken) {
      const isValidToken = await verifyToken(accessToken);
      if (isValidToken) {
        return NextResponse.redirect(new URL("/", request.url));
      } else {
        return NextResponse.redirect(new URL("/logout", request.url));
      }
    }
  }

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!accessToken) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    let isValidToken = await verifyToken(accessToken);

    if (!isValidToken && refreshToken) {
      const newAccessToken = await refresh(refreshToken);
      if (newAccessToken) {
        // Se asegura de que el nuevo accessToken se reemplace en las cookies
        const response = NextResponse.next();
        response.cookies.set("accessToken", newAccessToken, { httpOnly: true });
        return response;
      }
    }

    if (!isValidToken) {
      return NextResponse.redirect(new URL("/logout", request.url));
    }

    if (pathname.startsWith("/dashboard")) {
      const isAdmin = await verifyAdmin(accessToken);
      if (!isAdmin) {
        return NextResponse.redirect(new URL("/not-authorized", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/password-recovery",
    "/password-reset",
    "/sign-in",
    "/sign-up",
  ],
};
