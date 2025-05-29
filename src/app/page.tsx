"use client";

import { useState, FormEvent } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100 items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl bg-white bg-opacity-90 p-8 shadow-lg backdrop-blur-md">
        <h1 className="mb-8 text-center text-3xl font-extrabold text-gray-900">
          Bem-vindo de volta!
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <label htmlFor="email" className="text-sm font-semibold text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="seu@email.com"
            className="rounded-md border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />

          <label htmlFor="password" className="text-sm font-semibold text-gray-700">
            Senha
          </label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            className="rounded-md border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />

          {error && (
            <p className="text-sm text-red-600 font-semibold text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-4 rounded-md bg-blue-600 py-3 text-white font-semibold transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
