"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Database } from "@/database.types";
import { KeyValueConfigStore } from "@/lib/key-value-store-names";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const passwordSchema = z.object({
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(8, {
      message: "Password must be at least 8 characters",
    })
    .max(100, {
      message: "Password must be at most 100 characters",
    }),
});

type PasswordForm = z.infer<typeof passwordSchema>;

export default function EnterPasswordPage() {
  const supabase = createClientComponentClient<Database>();

  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
    },
  });

  const validatePassword = async (submittedPassword: string) => {
    const { data: actualPassword, error } = await supabase
      .from("config")
      .select("*")
      .eq("key", KeyValueConfigStore.PASSWORD)
      .single();

    if (error) {
      console.error(error);
      return false;
    }

    return submittedPassword === actualPassword.value;
  };

  const onSubmit = async (values: PasswordForm) => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    const isValid = await validatePassword(values.password);

    if (!isValid) {
      toast({
        title: "Invalid password",
        description: "Please try again.",
        variant: "destructive",
      });
    }

    toast({
      title: "Success",
      description: "You have successfully joined the meeting.",
    });

    setIsSubmitting(false);
  };

  return (
    <div className="h-full w-full flex items-center justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-w-[400px] flex flex-col"
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meeting Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" placeholder="password" />
                </FormControl>

                <FormDescription>
                  You can get the password from the meeting host.
                </FormDescription>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="mt-4 self-end"
            disabled={isSubmitting}
          >
            Join Meeting
          </Button>
        </form>
      </Form>
    </div>
  );
}
