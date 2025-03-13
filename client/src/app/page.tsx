"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/app/utils/auth";

export default function Home() {
  const router = useRouter();
  console.log(isAuthenticated())
  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/dashboard"); // Redirect to dashboard if logged in
    } else {
      router.push("/login"); // Redirect to login page if not logged in
    }
  }, []);

  return <div>Loading...</div>;
}
