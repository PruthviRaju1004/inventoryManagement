"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/{components}/sidebar";
import Navbar from "@/app/{components}/navbar";
import { isAuthenticated } from "@/app/utils/auth";
import { useAppSelector } from "../redux";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  useEffect(() => {
    if (!isAuthenticated()) router.push("/login"); // Protects dashboard
    if (isDarkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.add("light");
      }
  }, [isDarkMode, router]);  

  return (
    <div className={`${isDarkMode ? "dark" : "light"} flex bg-gray-50 text-gray-900 w-full min-h-screen`}>
      <Sidebar />
      <main className={`flex flex-col w-full h-full py-7 px-9 bg-gray-50 ${isSidebarCollapsed ? "md:pl-24" : "md:pl-72"}`}>
        <Navbar />
        {children}
      </main>
    </div>
  );
}
