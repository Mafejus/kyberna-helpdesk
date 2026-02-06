"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user || user.role !== 'ADMIN') {
                router.push('/dashboard'); 
            }
        }
    }, [user, loading, router]);

    if (loading) {
        return <div className="p-8">Načítání...</div>;
    }

    if (!user || user.role !== 'ADMIN') {
        return null; // Don't render admin content while redirecting
    }

    return <>{children}</>;
}
