"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function Home() {
  const supabase = createClientComponentClient();

  return (
    <div className="flex justify-center items-center h-full">
      <h1 className="text-5xl">Hello World!</h1>
    </div>
  );
}
