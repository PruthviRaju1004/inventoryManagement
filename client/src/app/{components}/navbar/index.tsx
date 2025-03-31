"use client";

import React, { useState } from "react";
import { UserCircle, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/app/redux";
import { clearUser } from "@/state/userSlice";
import { Typography } from "@mui/material";

const Navbar = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token"); // Remove token
        localStorage.removeItem("userOrg"); // Remove userOrg
        dispatch(clearUser());
        router.push("/login"); // Redirect to login
    };

    return (
        <div className="flex justify-between items-center w-full mb-7">
            <div className="flex justify-between items-center gap-5 text-2xl">App Name</div>
            <div className="flex justify-between items-center gap-5">
                <div className="relative">
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center space-x-2 px-4 py-2 rounded-lg"
                    >
                        <UserCircle size={48} />
                        <div>
                            <Typography className="font-bold">
                                {user?.firstName} {user?.lastName}
                            </Typography>
                            <Typography>{user?.email}</Typography>
                        </div>
                    </button>
                    {/* Dropdown Menu */}
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-40 bg-white text-gray-900 rounded-lg shadow-lg z-10">
                            <ul className="py-2">
                                <li
                                    onClick={handleLogout}
                                    className="px-4 py-2 flex items-center space-x-2 hover:bg-red-500 hover:text-white cursor-pointer"
                                >
                                    <LogOut size={18} />
                                    <span>Logout</span>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
