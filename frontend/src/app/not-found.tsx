import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/back-button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background p-4 text-center">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-9xl font-black tracking-tighter text-foreground/10 select-none">
            404
          </h1>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Page not found
          </h2>
          <p className="text-muted-foreground mx-auto max-w-[600px] text-lg">
            Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or never existed.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <BackButton />
          <Button asChild>
            <Link href="/" className="gap-2">
              <Home className="h-4 w-4" />
              Go to Dashboard
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] dark:bg-zinc-950">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>
      </div>
    </div>
  );
}
