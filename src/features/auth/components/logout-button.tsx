"use client";

import { useState } from "react";

export function LogoutButton() {
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      window.location.replace("/login");
    }
  };

  return (
    <button
      type="button"
      onClick={logout}
      disabled={loading}
      className="border-b-2 border-transparent py-1 text-sm text-black/60 transition-colors hover:text-black disabled:opacity-50"
    >
      {loading ? "Logging out…" : "Logout"}
    </button>
  );
}
