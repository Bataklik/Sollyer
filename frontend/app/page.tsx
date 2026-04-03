import { Navbar } from "@/components/navbar";
import { Dashboard } from "@/components/dashboard";
import { cookies } from "next/headers";

export default async function Home() {
    const cookieStore = await cookies();
    const isLoggedIn = cookieStore.get("auth")?.value === "true";

    return (
        <div className="min-h-screen bg-background">
            <Navbar isLoggedIn={isLoggedIn} />
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <Dashboard isLoggedIn={isLoggedIn} />
            </main>
        </div>
    );
}
