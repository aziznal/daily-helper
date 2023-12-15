"use client";

import { Database } from "@/database.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useCallback, useEffect, useState } from "react";
import { PersonStanding, Check, Hand } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Person = Database["public"]["Tables"]["people"]["Row"];

export default function Home() {
  const supabase = createClientComponentClient<Database>();
  const [users, setUsers] = useState<Person[]>([]);
  const [self, setSelf] = useState<Person | null>(null);
  const { toast } = useToast();

  const toggleSelfHasTalked = useCallback(async () => {
    if (!self) return;

    const { data, error } = await supabase
      .from("people")
      .update({ has_talked: !self.has_talked })
      .eq("id", self?.id)
      .select()
      .single();

    // update self
    setSelf(data);

    if (error) {
      console.error(error);
      toast({
        title: "Error: Could not toggle has_talked",
        description: error.message,
      });
      return;
    }
  }, [self, supabase, toast]);

  const toggleSelfHasIssue = useCallback(async () => {
    if (!self) return;

    const { data, error } = await supabase
      .from("people")
      .update({ has_issue: !self.has_issue })
      .eq("id", self?.id)
      .select()
      .single();

    // update self
    setSelf(data);

    if (error) {
      console.error(error);
      toast({
        title: "Error: Could not toggle has_issue",
        description: error.message,
      });
      return;
    }
  }, [self, supabase, toast]);

  useEffect(() => {
    // do initial fetch
    const fetchUsers = async () => {
      const { data: users, error } = await supabase
        .from("people")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        console.error(error);
        toast({
          title: "Error",
          description: error.message,
        });
        return;
      }

      setUsers(users);
    };

    // add self to the list of people when first joining
    const addSelf = async () => {
      const { data, error } = await supabase
        .from("people")
        .insert({
          name: "John Doe " + Math.random().toString(36).substring(7),
        })
        .select()
        .single();

      if (error) {
        console.error(error);
        toast({
          title: "Error while joining daily room",
          description: error.message,
        });
        return;
      }

      setSelf(data);
    };

    addSelf().then(fetchUsers);

    // track when a new person joins
    const personJoinsSub = supabase
      .channel("people")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "people" },
        (payload) => {
          setUsers((users) => [...users, payload.new as Person]);
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "people" },
        (payload) => {
          setUsers((users) =>
            users.filter((user) => user.id !== payload.old.id)
          );
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "people" },
        (payload) => {
          console.log(payload.new);

          setUsers((users) =>
            users.map((user) => {
              if (user.id === payload.new.id) {
                return payload.new as Person;
              }
              return user;
            })
          );
        }
      )
      .subscribe();

    return () => {
      personJoinsSub.unsubscribe();
    };
  }, [supabase, toast]);

  const handleUnload = useCallback(async () => {
    if (!self) return;

    // remove self from the list of people when leaving
    navigator.sendBeacon(`/api/leave/${self.id}`);
  }, [self]);

  // remove self from the list of people when leaving
  useEffect(() => {
    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [handleUnload]);

  return (
    <div className="justify-center items-center h-full flex bg-neutral-900 flex-col">
      <ul className="flex flex-wrap items-center justify-center gap-12 p-4 transition-all mb-12">
        {users.map((user) => (
          <li
            className="text-white w-[200px] flex flex-col items-center justify-top transition-all"
            key={user.id}
          >
            <PersonStanding size={64} />

            <div
              className={cn(
                "flex flex-col items-center gap-1",
                // if user is self
                user.id === self?.id && "text-yellow-500 font-bold",

                // if user has talked
                user.id !== self?.id && user.has_talked && "text-green-500",

                // if user has issue
                user.id !== self?.id && user.has_issue && "text-red-500"
              )}
            >
              <span>
                {user.id !== self?.id && user.has_talked && " (Done)"}
              </span>

              <span>
                {user.id !== self?.id && user.has_issue && " (Issue Raised!)"}
              </span>

              <span>
                {user.name} {user.id === self?.id && " (You)"}
              </span>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex gap-4">
        {/* Toggle Has Talked */}
        <Button
          variant="default"
          onClick={toggleSelfHasTalked}
          disabled={self?.has_talked}
          className={cn(
            "flex gap-1 items-center justify-center w-[90px] hover:bg-green-700 hover:text-white",
            self?.has_talked && "bg-green-500",
            !self?.has_talked && "bg-blue-500"
          )}
        >
          <span>{self?.has_talked ? "Done" : "Finish"}</span>

          <Check />
        </Button>

        {/* Toggle Has Issue */}
        <Button
          variant="default"
          onClick={toggleSelfHasIssue}
          className={cn(
            "flex gap-1 items-center justify-center w-[140px] hover:bg-cyan-700 hover:text-white",
            self?.has_issue && "bg-cyan-500",
            !self?.has_issue && "bg-white text-black"
          )}
        >
          <span>{self?.has_issue ? "Hand Raised!" : "Raise Hand"}</span>

          <Hand />
        </Button>
      </div>
    </div>
  );
}
