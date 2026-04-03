"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async () => {
        setLoading(true);
        setError("");

        const res = await fetch("/api/auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password }),
        });

        if (res.ok) {
            router.push("/");
            router.refresh();
        } else {
            setError("Fout wachtwoord, probeer opnieuw.");
        }
        setLoading(false);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#EEF1FF]">
            <div className="w-full max-w-sm rounded-xl border bg-white p-8 shadow-sm">
                <h1 className="mb-2 text-2xl font-semibold text-slate-800">
                    Sollyer
                </h1>
                <p className="mb-6 text-sm text-slate-500">
                    Log in om te beheren
                </p>
                <div className="space-y-4">
                    <Input
                        type="password"
                        placeholder="Wachtwoord"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    />
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <Button
                        className="w-full bg-[#B1B2FF] text-slate-800 hover:bg-[#9d9eff]"
                        onClick={handleLogin}
                        disabled={loading}
                    >
                        {loading ? "Laden..." : "Inloggen"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
