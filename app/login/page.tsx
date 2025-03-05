"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function AuthPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  // Handle Email/Password login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }
      // Redirect to homepage
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Login error");
    }
  };

  // Handle sign-up (registration)
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Sign up failed");
      }
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Sign up error");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="w-full border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center">
            <Link href="/">
              <Image
                src="https://i.imgur.com/7L1Xsfa.png"
                alt="Homebase Logo"
                width={40}
                height={40}
              />
            </Link>
            <span className="ml-2 text-xl font-bold text-[#0052FF]">
              Homebase
            </span>
          </div>
          {/* Support and Language Dropdowns */}
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <button className="text-gray-700 hover:text-blue-600 transition-colors">
                Support
              </button>
              <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 shadow-md hidden group-hover:block">
                <ul className="flex flex-col">
                  <li>
                    <Link
                      href="/docs"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <a
                      href="mailto:homebasemarkets@gmail.com"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Contact Us
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="relative group">
              <button className="text-gray-700 hover:text-blue-600 transition-colors">
                English
              </button>
              <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 shadow-md hidden group-hover:block">
                <ul className="flex flex-col">
                  <li>
                    <button className="block px-4 py-2 text-left hover:bg-gray-100 w-full">
                      English
                    </button>
                  </li>
                  <li>
                    <button className="block px-4 py-2 text-left hover:bg-gray-100 w-full">
                      Español
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Page Title Lowered */}
      <div className="mt-20 mb-4 text-center">
        <h1 className="text-2xl font-bold text-gray-800">
          {isSignUp ? "Sign up for Homebase" : "Log in to Homebase"}
        </h1>
      </div>

      {/* Main Container */}
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-md p-6 border border-gray-200 rounded-md shadow-sm">
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {isSignUp ? (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  required
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-[#0052FF] text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Sign Up
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-[#0052FF] text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Log In
              </button>
            </form>
          )}
          {/* Toggle between login and sign-up */}
          <div className="text-center mt-4">
            {isSignUp ? (
              <p className="text-sm text-gray-700">
                Already have an account?{" "}
                <button
                  onClick={() => setIsSignUp(false)}
                  className="text-[#0052FF] hover:underline"
                >
                  Sign in
                </button>
              </p>
            ) : (
              <p className="text-sm text-gray-700">
                Don&apos;t have an account?{" "}
                <button
                  onClick={() => setIsSignUp(true)}
                  className="text-[#0052FF] hover:underline"
                >
                  Sign up
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}










