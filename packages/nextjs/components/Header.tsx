"use client";

import React, { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthButton from "./AuthButton";
import { Logo } from "./Logo";
import { Bars3Icon, BugAntIcon, HomeIcon } from "@heroicons/react/24/outline";
import { DappConsoleButton, FaucetButton, SuperchainFaucetButton } from "~~/components/scaffold-eth";
import { useOutsideClick } from "~~/hooks/scaffold-eth";
import { useAuth } from "~~/hooks/useAuth";
import { cn } from "~~/utils/cn";

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export const menuLinks: HeaderMenuLink[] = [
  {
    label: "Home",
    href: "/",
    icon: <HomeIcon className="h-4 w-4" />,
  },
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <HomeIcon className="h-4 w-4" />,
  },
  {
    label: "Rescue a Tree",
    href: "/rescata-arbol",
    icon: <HomeIcon className="h-4 w-4" />,
  },
  {
    label: "Debug Contracts",
    href: "/debug",
    icon: <BugAntIcon className="h-4 w-4" />,
  },
];

export const HeaderMenuLinks = () => {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  // Only show menu options if authenticated on Lisk Sepolia
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {menuLinks.map(({ label, href, icon }) => {
        const isActive = pathname === href;
        return (
          <li key={href}>
            <Link
              href={href}
              passHref
              className={cn(
                "relative flex items-center justify-between px-4 py-2 text-sm transition-colors duration-200",
                isActive ? "bg-base-100 primary-content" : "text-slate-400",
              )}
            >
              {icon}
              {label}
            </Link>
          </li>
        );
      })}
    </>
  );
};

/**
 * Site header
 */
export const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useAuth();

  useOutsideClick(
    burgerMenuRef,
    useCallback(() => setIsDrawerOpen(false), []),
  );

  return (
    <header className="sticky lg:static top-0 navbar bg-base-900 min-h-0 flex-shrink-0 justify-between z-20 px-0 sm:px-2 border-b border-[#252442]">
      <div className="navbar-start w-auto lg:w-1/2">
        {isAuthenticated && (
          <div className="lg:hidden dropdown" ref={burgerMenuRef}>
            <label
              tabIndex={0}
              className={`ml-1 btn btn-ghost ${isDrawerOpen ? "hover:bg-secondary" : "hover:bg-transparent"}`}
              onClick={() => {
                setIsDrawerOpen(prevIsOpenState => !prevIsOpenState);
              }}
            >
              <Bars3Icon className="h-1/2" />
            </label>
            {isDrawerOpen && (
              <ul
                tabIndex={0}
                className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
                onClick={() => {
                  setIsDrawerOpen(false);
                }}
              >
                <HeaderMenuLinks />
              </ul>
            )}
          </div>
        )}
        {isAuthenticated && (
          <>
            <Link href="/" passHref className="hidden lg:flex items-center gap-2 ml-4 mr-6 shrink-0">
              <div className="flex relative">
                <Logo size={24} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold leading-tight">GreenFi</span>
                <span className="text-xs">Eco Finance Platform</span>
              </div>
            </Link>
            <ul className="hidden lg:flex lg:flex-nowrap menu menu-horizontal px-1 gap-2">
              <HeaderMenuLinks />
            </ul>
          </>
        )}
      </div>
      <div className="navbar-end flex-grow mr-4">
        <AuthButton />
        <FaucetButton />
        <SuperchainFaucetButton />
        <DappConsoleButton />
      </div>
    </header>
  );
};
