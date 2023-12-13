import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

import { cookies } from "next/headers";
import { Database } from "@/database.types";

export async function POST(
  _req: NextRequest,
  { params }: { params: { participantId: string } }
) {
  const supabase = createRouteHandlerClient<Database>({ cookies });

  console.log(`deleting participant ${params.participantId}`);

  const { error } = await supabase
    .from("people")
    .delete()
    .match({ id: params.participantId });

  if (error) {
    console.error(error);
  }

  return NextResponse.json({
    message: "Done!",
  });
}
