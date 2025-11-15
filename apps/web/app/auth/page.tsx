"use client";
import { motion } from "motion/react";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Ensure this is imported

export default function AuthPage() {
  const router = useRouter();
  const [isLoginView, setIsLoginView] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setEmail("");
    setPassword("");
    setName("");
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (isLoginView) {
      try {
        const response = await fetch("http://localhost:4000/api/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Sign in failed");
        }

        localStorage.setItem("token", data.token);
        setSuccess("Sign in successful! Redirecting...");
        router.push("/");

      } catch (err: any) {
        setError(err.message);
      }

    } else {
      // --- SIGNUP LOGIC ---
      try {
        const response = await fetch("http://localhost:4000/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Sign up failed");
        }

        setSuccess("Sign up successful! Please sign in.");

        // 3. Switch view to 'Sign In' so user can log in immediately
        toggleView();

      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-gray-900">
          {isLoginView ? "Sign In" : "Create Account"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginView && (
            <div>
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-black"
              />
            </div>
          )}

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-black"
            />
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-black"
            />
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-sm text-red-600 text-center">
              {error}
            </p>
          )}

          {/* Success Message */}
          {success && (
            <p className="text-sm text-green-600 text-center">
              {success}
            </p>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isLoginView ? "Sign In" : "Create Account"}
            </button>
          </div>
        </form>

        {/* Toggle Link */}
        <p className="text-sm text-center text-gray-600">
          {isLoginView ? "Don't have an account?" : "Already have an account?"}
          <button
            onClick={toggleView}
            className="ml-1 font-medium text-blue-600 hover:text-blue-500"
          >
            {isLoginView ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
}
