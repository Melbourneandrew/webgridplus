"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
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
      router.push("/game");
      router.refresh();
    }

    setLoading(false);
  };

  return (
    <div className="mx-auto mt-10 max-w-md rounded border p-4">
      <h1 className="mb-4 text-2xl font-bold">Login to Webgrid+</h1>
      <form onSubmit={submit} className="flex flex-col gap-3">
        <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" required />
        <button disabled={loading} type="submit" className="rounded bg-black px-3 py-1 text-white">Login</button>
      </form>
      <a href="/signup" className="mt-2 block text-center underline">Signup</a>
      {error ? <p className="text-red-600">{error}</p> : null}
    </div>
  );
}
