"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function SignupForm() {
  const router = useRouter();
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
      router.push("/game");
      router.refresh();
    }

    setLoading(false);
  };

  return (
    <div className="mx-auto mt-10 max-w-md rounded border p-4">
      <h1 className="mb-4 text-2xl font-bold">Sign Up for Webgrid+</h1>
      <form onSubmit={submit} className="flex flex-col gap-3">
        <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} placeholder="Display Name" required />
        <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" required />
        <button disabled={loading} type="submit" className="rounded bg-black px-3 py-1 text-white">Sign up</button>
      </form>
      <a href="/login" className="mt-2 block text-center underline">Login</a>
      {error ? <p className="text-red-600">{error}</p> : null}
    </div>
  );
}
