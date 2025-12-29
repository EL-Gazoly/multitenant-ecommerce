"use client";
import { useTRPC } from "@/trpc/cliient";
import { useQuery } from "@tanstack/react-query";
export default function Home() {
  const trpc = useTRPC();
  const { data: session } = useQuery(trpc.auth.session.queryOptions());

  return (
    <main>{session && <pre>{JSON.stringify(session, null, 2)}</pre>}</main>
  );
}
