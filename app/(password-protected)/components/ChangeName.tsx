"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Database } from "@/database.types";
import { Person } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Pen } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type ChangeNameComponentProps = {
  person: Person;
};

const nameChangeFormSchema = z.object({
  name: z
    .string({
      required_error: "Please enter a name",
    })
    .min(1, "Please enter a name")
    .max(30, "Name must be less than 30 characters"),
});

type NameForm = z.infer<typeof nameChangeFormSchema>;

export default function ChangeName({ person }: ChangeNameComponentProps) {
  const supabase = createClientComponentClient<Database>();
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<NameForm>({
    resolver: zodResolver(nameChangeFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (submittedValues: NameForm) => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    const { error } = await supabase
      .from("people")
      .update({
        name: submittedValues.name,
      })
      .eq("id", person.id);

    if (error) {
      console.error(error);
      toast({
        title: "Error: Could not update name",
        description: error.message,
      });
    }

    setIsSubmitting(false);

    form.reset();
    setIsOpen(false);
  };

  return (
    <div className="flex gap-2">
      <span>{person.name}</span>

      <span>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger>
            <Pen className="color:white opacity-70 hover:opacity-100 transition-opacity cursor-pointer" />
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change your name</DialogTitle>
              <DialogDescription>
                This name is visible to others in the daily
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>

                      <FormControl>
                        <Input {...field} />
                      </FormControl>

                      <FormDescription>
                        Name should be between 1 and 30 chars
                      </FormDescription>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-fit self-end"
                  disabled={isSubmitting}
                >
                  Update
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </span>
    </div>
  );
}
