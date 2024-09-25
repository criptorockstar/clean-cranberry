"use client";

import * as React from "react";
import { useAppDispatch } from "@/store/store";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { clearUser } from "@/store/slices/userSlice";

export default function Logout() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const clean = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    dispatch(clearUser());
  };

  React.useEffect(() => {
    clean();
    router.push("/sign-in");
  }, [router]);

  return <>Logging out...</>;
}
