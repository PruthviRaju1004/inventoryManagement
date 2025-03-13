"use client";

import React, { useState } from 'react';
import { ChevronDown, UserCircle, LogOut } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/redux';
import { setIsDarkMode, setIsSidebarCollapsed } from '@/state';
import { useRouter } from "next/navigation";
import { useGetCurrentUserQuery } from '../../../state/api';
import { Typography } from "@mui/material";

type Props = {}

const Navbar = (props: Props) => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { data: user, isLoading, isError } = useGetCurrentUserQuery();
    const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed);
    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggleSidebar = () => {
        dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
    };
    const toggleDarkMode = () => {
        dispatch(setIsDarkMode(!isDarkMode));
    };
    const handleLogout = () => {
        localStorage.removeItem("token"); // Remove token
        router.push("/login"); // Redirect to login
    };
    return (
        <div className='flex justify-between items-center w-full mb-7'>
            <div className='flex justify-between items-center gap-5 text-2xl'>
                App Name
            </div>
            <div className="flex justify-between items-center gap-5">
                <div className="hidden md:flex justify-between items-center gap-5">
                    {/* <div>
                        <button onClick={toggleDarkMode}>
                            {isDarkMode ? (
                                <Sun className="cursor-pointer text-gray-500" size={24} />
                            ) : (
                                <Moon className="cursor-pointer text-gray-500" size={24} />
                            )}
                        </button>
                    </div> */}
                    {/* <hr className="w-0 h-7 border border-solid border-l border-gray-300 mx-3" /> */}
                    {/* <div className="flex items-center gap-3 cursor-pointer">
                        {isLoading ? (
                            <span className="font-semibold">Loading...</span>
                        ) : isError ? (
                            <span className="text-red-500">Error fetching user</span>
                        ) : (
                            <span className="font-semibold">{user?.name || "User"}</span>
                        )}
                    </div> */}
                </div>
                <div className="relative">
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center space-x-2   px-4 py-2 rounded-lg"
                    >
                        <UserCircle size={48} />
                        <div>
                            <Typography className='font-bold'>{user?.firstName}{" "}{user?.lastName}</Typography>
                            <Typography>{user?.email}</Typography>
                        </div>
                        {/* <ChevronDown size={20}/> */}
                    </button>
                    {/* Dropdown Menu */}
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-40 bg-white text-gray-900 rounded-lg shadow-lg z-10 ">
                            <ul className="py-2">
                                {/* <li className="px-4 py-2 flex items-center space-x-2 hover:bg-gray-200 cursor-pointer">
                                    <span>Profile</span>
                                </li> */}
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
    )
}
export default Navbar;