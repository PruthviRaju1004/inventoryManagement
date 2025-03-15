"use client";
import React from 'react';
import {
    Building,
    ClipboardCheck,
    Layout,
    LucideIcon,
    Menu,
    Truck,
    Users,
    FileText,
    Warehouse,
    Package,
    ClipboardList
} from "lucide-react";
// import Image from "next/image";
import Link from "next/link";
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/app/redux';
import { usePathname } from "next/navigation";
import { setIsSidebarCollapsed } from '@/state';

interface SidebarLinkProps {
    href: string;
    icon: LucideIcon;
    label: string;
    isCollapsed: boolean;
}

const SidebarLink = ({
    href,
    icon: Icon,
    label,
    isCollapsed,
}: SidebarLinkProps) => {
    const pathname = usePathname();
    const isActive = pathname === href || (pathname === "/" && href === "/dashboard");

    return (
        <Link href={href}>
            <div
                className={`cursor-pointer flex items-center ${isCollapsed ? "justify-center py-4" : "justify-start px-8 py-4"}
                hover:text-blue-500 hover:bg-blue-100 gap-3 transition-colors ${isActive ? "bg-blue-200 text-white" : ""}}`}>
                <Icon className="w-6 h-6 !text-gray-700" />
                <span className={`${isCollapsed ? "hidden" : "block"} font-medium text-gray-700`}>
                    {label}
                </span>
            </div>
        </Link>
    );
};

const Sidebar = () => {
    const dispatch = useDispatch();
    const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed);
    const toggleSidebar = () => {
        dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
    }
    const sidebarClassNames = `fixed flex flex-col ${isSidebarCollapsed ? "w-0 md:w-16" : "w-72 md:w-64"
        } bg-white transition-all duration-300 overflow-hidden h-full shadow-md z-40`;
    return (
        <div className={sidebarClassNames}>
            <div className={`flex gap-3 justify-between md:justify-normal items-center pt-8
            ${isSidebarCollapsed ? "px-2" : "px-6"}`}>
                <button className="px-3 py-3 bg-gray-100 rounded-full hover:bg-blue-100"
                    onClick={toggleSidebar}>
                    <Menu className="w-6 h-6" />
                </button>
                <div>
                    logo
                </div>
                {/* <h1 className={`${isSidebarCollapsed ? "hidden" : "block"} font-extrabold text-2xl`}>
                    Name
                </h1> */}
            </div>
            <div className="flex-grow mt-8">
                <SidebarLink
                    href="/dashboard"
                    icon={Layout}
                    label="Dashboard"
                    isCollapsed={isSidebarCollapsed}
                />
                <SidebarLink
                    href="/organizations"
                    icon={Building}
                    label="Organizations"
                    isCollapsed={isSidebarCollapsed}
                />
                <SidebarLink
                    href="/warehouses"
                    icon={Warehouse}
                    label="Warehouses"
                    isCollapsed={isSidebarCollapsed}
                />
                <SidebarLink
                    href="/suppliers"
                    icon={Truck}
                    label="Suppliers"
                    isCollapsed={isSidebarCollapsed}
                />
                <SidebarLink
                    href="/customers"
                    icon={Users}
                    label="Customers"
                    isCollapsed={isSidebarCollapsed}
                />
                <SidebarLink
                    href="/products"
                    icon={Package}
                    label="Products"
                    isCollapsed={isSidebarCollapsed}
                />
                <SidebarLink
                    href="/purchaseOrders"
                    icon={FileText}
                    label="Purchase Orders"
                    isCollapsed={isSidebarCollapsed}
                />
                <SidebarLink
                    href="/grns"
                    icon={ClipboardCheck}
                    label="GRN"
                    isCollapsed={isSidebarCollapsed}
                />
                <SidebarLink
                    href="/inventory"
                    icon={ClipboardList}
                    label="Inventory Reports"
                    isCollapsed={isSidebarCollapsed}
                />
            </div>
            <div className={`${isSidebarCollapsed ? "hidden" : "block"} mb-10`}>
                <p className='text-center text-gray-500 text-xs'>
                    &copy; 2025 All rights reserved
                </p>
            </div>
        </div>
    )
}

export default Sidebar