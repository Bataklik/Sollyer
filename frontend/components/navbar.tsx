"use client";

import { Briefcase } from "lucide-react";

interface NavbarProps {
    isLoggedIn: boolean;
}
export function Navbar({ isLoggedIn }: NavbarProps) {
    return (
        <nav className="border-b bg-white/80 backdrop-blur-sm">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#B1B2FF]">
                            <Briefcase className="h-5 w-5 text-slate-800" />
                        </div>
                        <span className="text-xl font-bold text-[#6366f1]">
                            Sollyer
                        </span>
                    </div>
                    {isLoggedIn ? (
                        <button
                            onClick={async () => {
                                await fetch("/api/auth", {
                                    method: "DELETE",
                                });
                                window.location.reload();
                            }}
                        >
                            Uitloggen
                        </button>
                    ) : (
                        <button
                            onClick={() => {
                                window.location.href = "/login";
                            }}
                        >
                            Inloggen
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}
