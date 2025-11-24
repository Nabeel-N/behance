"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

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

    // Ensure this matches your backend URL
    const API_BASE = "http://localhost:4000";
    const endpoint = isLoginView
      ? `${API_BASE}/api/signin`
      : `${API_BASE}/api/signup`;

    const payload = isLoginView
      ? { email, password }
      : { name, email, password };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      console.log("Server Response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed");
      }

      if (isLoginView) {
        if (data.token) {
          
          localStorage.setItem("bhance_token", data.token);

          setSuccess("Sign in successful! Redirecting...");

          setTimeout(() => router.push("/"), 500);
        } else {
          console.error("Login succeeded but no token found in:", data);
          setError("Login error: Server did not return a token.");
        }
      } else {
        setSuccess("Sign up successful! Please sign in.");
        toggleView();
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message);
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
              <label className="text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLoginView}
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md text-black"
              />
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md text-black"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md text-black"
            />
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          {success && <p className="text-sm text-green-600 text-center">{success}</p>}

          <button
            type="submit"
            className="w-full py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700 font-bold"
          >
            {isLoginView ? "Sign In" : "Create Account"} </button>
        </form>

        <p className="text-sm text-center text-gray-600">
          {isLoginView ? "Don't have an account?" : "Already have an account?"}
          <button onClick={toggleView} className="ml-1 font-medium text-blue-600 hover:text-blue-500">
            {isLoginView ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
}
