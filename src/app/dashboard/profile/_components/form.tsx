"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";

import { useToast } from "@/components/ui/use-toast";
import { useProfile } from "@/lib/swr";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CaretSortIcon } from "@radix-ui/react-icons";
import axios from "axios";
import { CheckIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  phone: z
    .string()
    .nonempty()
    .regex(/^[0-9]{10}$/, "Enter a valid phone number."),
  bio: z.string().optional(),
  name: z.string().min(5, "Minimum 5 characters required").nonempty("Required"),
  college: z.string().nonempty(),
  image: z.string().url().optional(),
  designation: z.string().nonempty(),
  links: z
    .object({
      instagram: z.string().url(),
      linkedin: z.string().url(),
      github: z.string().url(),
      facebook: z.string().url(),
      twitter: z.string().url(),
      threads: z.string().url(),
      telegram: z.string().url(),
    })
    .optional(),
});

export function ProfileForm({
  collegeList,
}: {
  collegeList: {
    id: string;
    name: string;
    code: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
}) {
  const { toast } = useToast();
  const { data: user, mutate } = useProfile();

  const redirect = useSearchParams().get("redirect");
  const { replace } = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    form.reset({
      name: user?.name,
      designation: user?.designation || "",
      college: user?.college?.code || "",
      phone: user?.phone || "",
      bio: user?.bio,
      //   links: user?.userLinks.reduce((acc, curr) => {
      //     acc[curr.name] = curr.url;
      //     return acc;
      //   }, {} as Record<string, string>),
    });
  }, [form, user]);

  function onSubmit(data: z.infer<typeof formSchema>) {
    axios
      .put("/api/secure/profile", data)
      .then((_res) => {
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
        });
        mutate();
        redirect && replace(redirect);
      })
      .catch((_err) => {
        toast({
          title: "Profile Update Failed",
          description: "Your profile could not be updated.",
          variant: "destructive",
        });
      });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <section className="grid  md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem aria-required>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormDescription>Enter you full name.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="designation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Designation</FormLabel>
                <FormControl>
                  <Input placeholder="Lecturer" {...field} />
                </FormControl>
                <FormDescription>Your current Designation</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="college"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="my-1">College</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "min-w-[340px] justify-between truncate whitespace-nowrap flex-nowrap overflow-hidden",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? collegeList.find(
                              (language) => language.code === field.value
                            )?.name
                          : "Select College"}
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[600px] p-0" align="start">
                    <Command>
                      <CommandInput
                        placeholder="Search colleges..."
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>No college found.</CommandEmpty>
                        <CommandGroup>
                          {collegeList.map((college) => (
                            <CommandItem
                              value={college.name}
                              key={college.code}
                              onSelect={() => {
                                form.setValue("college", college.code);
                              }}
                            >
                              {college.name}
                              <CheckIcon
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  college.code === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Select the college you are currently working in.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone number</FormLabel>
                <FormControl>
                  <Input placeholder="+91 97xxxx" {...field} />
                </FormControl>
                <FormDescription>Enter you phone number.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Few words about you (optional)"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is optional. You can tell us a little bit about yourself.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          role="button"
          disabled={form.formState.isSubmitting}
          type="submit"
        >
          Updated profile
        </Button>
      </form>
    </Form>
  );
}
