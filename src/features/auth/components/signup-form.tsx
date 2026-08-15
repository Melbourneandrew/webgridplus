"use client";

import { FormEvent, useState } from "react";
import { AuthFormShell, authInputClassName, authSubmitClassName } from "./auth-form-shell";
import { DISPLAY_NAME_MAX_LENGTH } from "@/domain/user/display-name";

export function SignupForm() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ displayName, email, password }),
      headers: { "content-type": "application/json" },
    });
    const payload = await response.json();

    if (!response.ok) {
      setError(payload.error ?? "Error creating account");
    } else {
      // The root layout is rendered from the HttpOnly session cookie. A document
      // navigation guarantees the first authenticated screen includes that state.
      window.location.replace("/play");
      return;
    }

    setLoading(false);
  };

  return (
    <AuthFormShell activeTab="signup" title="Create your account" subtitle="Save your scores and claim a spot on the leaderboard.">
      <form onSubmit={submit} className="flex flex-col gap-4">
        <label className="grid gap-1.5 text-sm font-medium">
          Display name
          <input className={authInputClassName} value={displayName} onChange={(event) => setDisplayName(event.target.value)} placeholder="How you’ll appear" autoComplete="nickname" minLength={2} maxLength={DISPLAY_NAME_MAX_LENGTH} required />
        </label>
        <label className="grid gap-1.5 text-sm font-medium">
          Email
          <input className={authInputClassName} type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" required />
        </label>
        <label className="grid gap-1.5 text-sm font-medium">
          Password
          <input className={authInputClassName} type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" autoComplete="new-password" minLength={8} required />
        </label>
        {error ? <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
        <button disabled={loading} type="submit" className={authSubmitClassName}>{loading ? "Creating account…" : "Create account"}</button>
      </form>
    </AuthFormShell>
  );
}
