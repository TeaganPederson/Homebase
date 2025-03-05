"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const Header = () => {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false); // For desktop dropdown
  const [isToolsMobileOpen, setIsToolsMobileOpen] = useState(false); // For mobile submenu
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo & Brand */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="https://i.imgur.com/OML2njS.png"
              alt="Homebase Logo"
              width={40}
              height={40}
            />
            <span className="ml-2 text-xl font-medium relative top-1 md:top-0 flex items-center">
  <span className="text-[#0047CC] tracking-wide"></span> 
  <span className="ml-2 text-xs font-bold text-green-700 bg-green-100 border border-green-500 rounded-full px-3 py-0.5 flex items-center relative top-[1px]">
    v1 BETA
  </span>
</span>



          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/"
            className="text-gray-800 hover:text-[#0052FF] transition-colors"
          >
            Home
          </Link>

          {/* Tools Dropdown (Desktop) */}
          <div
            className="relative"
            // Enlarge the hover area to include both button and menu:
            onMouseEnter={() => setIsToolsOpen(true)}
            onMouseLeave={() => setIsToolsOpen(false)}
          >
            <button
              className="text-gray-800 hover:text-[#0052FF] transition-colors inline-flex items-center"
            >
              Tools
              <svg
                className="ml-1 w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            <ul
              className={`absolute z-10 left-0 top-full mt-1 bg-white border border-gray-200 rounded shadow-md w-56 py-2 transform transition-all duration-200 ease-out ${
                isToolsOpen
                  ? "opacity-100 scale-100 pointer-events-auto"
                  : "opacity-0 scale-95 pointer-events-none"
              }`}
            >
              <li>
                <Link
                  href="/whale-watcher"
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  {/* Eye Icon */}
                  <svg
                    className="w-4 h-4 text-[#0052FF]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7s-8.268-2.943-9.542-7z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Whale Watchers
                </Link>
              </li>
              <li>
                <Link
                  href="/token-scanner"
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  {/* MagnifyingGlass Icon */}
                  <svg
                    className="w-4 h-4 text-[#0052FF]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.15z"
                    />
                  </svg>
                  Token Screener
                </Link>
              </li>
              <li>
                <Link
                  href="/honeypot-scanner"
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  {/* ShieldExclamation Icon */}
                  <svg
                    className="w-4 h-4 text-[#0052FF]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4m0 4h.01M20.205 7.697l-7.2-3.6a1.3 1.3 0 00-1.01 0l-7.2 3.6A1.3 1.3 0 004 8.848v6.304a1.3 1.3 0 00.795 1.151l7.2 3.6c.315.158.694.158 1.01 0l7.2-3.6A1.3 1.3 0 0020 15.152V8.848a1.3 1.3 0 00-.795-1.151z"
                    />
                  </svg>
                  Honeypot Scanner
                </Link>
              </li>
              <li>
                <Link
                  href="/launch-calendar"
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  {/* CalendarDays Icon */}
                  <svg
                    className="w-4 h-4 text-[#0052FF]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Launch Calendar
                </Link>
              </li>
              <li>
                <Link
                  href="/terminal"
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  {/* Newspaper Icon */}
                  <svg
                    className="w-4 h-4 text-[#0052FF]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 20H5a2 2 0 01-2-2V5.4C3 5.179 3.179 5 3.4 5H5c.265 0 .52.105.707.293l.293.293h13a2 2 0 012 2V18a2 2 0 01-2 2z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 8h10M7 12h6m-6 4h10"
                    />
                  </svg>
                  News Terminal
                </Link>
              </li>
            </ul>
          </div>

          <Link
            href="/forum"
            className="text-gray-800 hover:text-[#0052FF] transition-colors"
          >
            Forum
          </Link>
          <Link
            href="/analysts"
            className="text-gray-800 hover:text-[#0052FF] transition-colors"
          >
            Analysts
          </Link>
          <Link
            href="/docs"
            className="text-gray-800 hover:text-[#0052FF] transition-colors"
          >
            Docs
          </Link>
          {session ? (
            <Link
              href="/account"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#0052FF] text-white hover:bg-blue-600 transition-colors"
            >
              <span>Account</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#0052FF] text-white hover:bg-blue-600 transition-colors"
            >
              <span>Sign in</span>
            </Link>
          )}
        </nav>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-gray-800 text-3xl"
          aria-label="Toggle Menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation Menu (Sliding Sidebar) */}
      <div
        className={`md:hidden fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 shadow-lg transform transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsMenuOpen(false)}
          className="absolute top-4 right-4 text-gray-800 bg-gray-100 rounded-full p-1 hover:bg-gray-200 transition"
          aria-label="Close Menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <nav className="flex flex-col gap-4 p-4 mt-12">
          <Link
            href="/"
            onClick={() => setIsMenuOpen(false)}
            className="text-gray-800 hover:text-[#0052FF] transition-colors"
          >
            Home
          </Link>

          {/* Tools Submenu (Mobile) */}
          <div>
            <button
              onClick={() => setIsToolsMobileOpen(!isToolsMobileOpen)}
              className="text-gray-800 hover:text-[#0052FF] transition-colors w-full text-left flex items-center justify-between"
            >
              <span>Tools</span>
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isToolsMobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                )}
              </svg>
            </button>
            {isToolsMobileOpen && (
              <ul className="mt-2 ml-4 space-y-2">
                <li>
                  <Link
                    href="/whale-watcher"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsToolsMobileOpen(false);
                    }}
                    className="block flex items-center gap-2 text-gray-800 hover:text-[#0052FF] transition-colors"
                  >
                    {/* Eye Icon */}
                    <svg
                      className="w-4 h-4 text-[#0052FF]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7s-8.268-2.943-9.542-7z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Whale Watchers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/token-scanner"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsToolsMobileOpen(false);
                    }}
                    className="block flex items-center gap-2 text-gray-800 hover:text-[#0052FF] transition-colors"
                  >
                    {/* MagnifyingGlass Icon */}
                    <svg
                      className="w-4 h-4 text-[#0052FF]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.15z"
                      />
                    </svg>
                    Token Screener
                  </Link>
                </li>
                <li>
                  <Link
                    href="/honeypot-scanner"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsToolsMobileOpen(false);
                    }}
                    className="block flex items-center gap-2 text-gray-800 hover:text-[#0052FF] transition-colors"
                  >
                    {/* ShieldExclamation Icon */}
                    <svg
                      className="w-4 h-4 text-[#0052FF]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8v4m0 4h.01M20.205 7.697l-7.2-3.6a1.3 1.3 0 00-1.01 0l-7.2 3.6A1.3 1.3 0 004 8.848v6.304a1.3 1.3 0 00.795 1.151l7.2 3.6c.315.158.694.158 1.01 0l7.2-3.6A1.3 1.3 0 0020 15.152V8.848a1.3 1.3 0 00-.795-1.151z"
                      />
                    </svg>
                    Honeypot Scanner
                  </Link>
                </li>
                <li>
                  <Link
                    href="/launch-calendar"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsToolsMobileOpen(false);
                    }}
                    className="block flex items-center gap-2 text-gray-800 hover:text-[#0052FF] transition-colors"
                  >
                    {/* CalendarDays Icon */}
                    <svg
                      className="w-4 h-4 text-[#0052FF]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Launch Calendar
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terminal"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsToolsMobileOpen(false);
                    }}
                    className="block flex items-center gap-2 text-gray-800 hover:text-[#0052FF] transition-colors"
                  >
                    {/* Newspaper Icon */}
                    <svg
                      className="w-4 h-4 text-[#0052FF]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 20H5a2 2 0 01-2-2V5.4C3 5.179 3.179 5 3.4 5H5c.265 0 .52.105.707.293l.293.293h13a2 2 0 012 2V18a2 2 0 01-2 2z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 8h10M7 12h6m-6 4h10"
                      />
                    </svg>
                    News Terminal
                  </Link>
                </li>
              </ul>
            )}
          </div>

          <Link
            href="/forum"
            onClick={() => setIsMenuOpen(false)}
            className="text-gray-800 hover:text-[#0052FF] transition-colors"
          >
            Forum
          </Link>
          <Link
            href="/analysts"
            onClick={() => setIsMenuOpen(false)}
            className="text-gray-800 hover:text-[#0052FF] transition-colors"
          >
            Analysts
          </Link>
          <Link
            href="/docs"
            onClick={() => setIsMenuOpen(false)}
            className="text-gray-800 hover:text-[#0052FF] transition-colors"
          >
            Docs
          </Link>

          {session ? (
            <Link
              href="/account"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#0052FF] text-white hover:bg-blue-600 transition-colors"
            >
              <span>Account</span>
            </Link>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#0052FF] text-white hover:bg-blue-600 transition-colors"
            >
              <span>Sign in</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
















