"use client";

import { FormEvent, useState } from "react";
import { AuthFormShell, authInputClassName, authSubmitClassName } from "./auth-form-shell";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "content-type": "application/json" },
    });
    const payload = await response.json();

    if (!response.ok) {
      setError(payload.error ?? "Invalid username or password");
    } else {
      window.location.replace("/game");
      return;
    }

    setLoading(false);
  };

  return (
    <AuthFormShell activeTab="login" title="Welcome back" subtitle="Log in to keep playing and track your scores.">
      <form onSubmit={submit} className="flex flex-col gap-4">
        <label className="grid gap-1.5 text-sm font-medium">
          Email
          <input className={authInputClassName} value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" required />
        </label>
        <label className="grid gap-1.5 text-sm font-medium">
          Password
          <input className={authInputClassName} type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Your password" autoComplete="current-password" required />
        </label>
        {error ? <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
        <button disabled={loading} type="submit" className={authSubmitClassName}>{loading ? "Logging in…" : "Log in"}</button>
      </form>
    </AuthFormShell>
  );
}
