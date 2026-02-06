"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">School Helpdesk</CardTitle>
          <CardDescription>Vítejte v systému pro správu požadavků</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Pro pokračování se prosím přihlaste do systému.
          </p>
          <div className="flex justify-center">
            <Link href="/login" passHref>
              <Button size="lg" className="w-full sm:w-auto">
                Přihlásit se
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
