import { NextResponse, NextRequest } from "next/server";

export const middleware = async (req: NextRequest) => {
  const token = req.cookies.get("token")?.value;
  const role = req.cookies.get("role")?.value;

  if (req.nextUrl.pathname === "/") {
    const redirectAdmin = req.nextUrl.clone();
    redirectAdmin.pathname = "/login";
    return NextResponse.redirect(redirectAdmin);
  }

  if (req.nextUrl.pathname === "/login" && token && role) {
    const redirectAdmin = req.nextUrl.clone();

    if (role === "ADMIN_STAN") {
      redirectAdmin.pathname = "/stan/dashboard";
    } else if (role === "SISWA") {
      redirectAdmin.pathname = "/siswa/home";
    } else {
      redirectAdmin.pathname = "/";
    }

    return NextResponse.redirect(redirectAdmin);
  }

  if (req.nextUrl.pathname.startsWith("/stan")) {
    if (!token || !role) {
      const redirectAdmin = req.nextUrl.clone();
      redirectAdmin.pathname = "/login";
      return NextResponse.redirect(redirectAdmin);
    }

    if (role !== "ADMIN_STAN") {
      const redirectAdmin = req.nextUrl.clone();
      redirectAdmin.pathname = "/login";
      return NextResponse.redirect(redirectAdmin);
    }
    return NextResponse.next();
  }

  if (req.nextUrl.pathname.startsWith("/siswa")) {
    if (!token || !role) {
      const redirectAdmin = req.nextUrl.clone();
      redirectAdmin.pathname = "/login";
      return NextResponse.redirect(redirectAdmin);
    }

    if (role !== "SISWA") {
      const redirectAdmin = req.nextUrl.clone();
      redirectAdmin.pathname = "/login";
      return NextResponse.redirect(redirectAdmin);
    }
    return NextResponse.next();
  }
  return NextResponse.next();
};

export const config = {
  matcher: ["/stan/:path", "/siswa/:path", "/", "/login"],
};
