"use client";

import { BranchListApiResponse } from "@/app/api/secure/branches/all/route";
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

import { useToast } from "@/components/ui/use-toast";
import { usePermenantGet, useProfile } from "@/lib/swr";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { College } from "@prisma/client";
import { CaretSortIcon } from "@radix-ui/react-icons";
import axios from "axios";
import { CheckIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(5, "Minimum 5 characters required").nonempty("Required"),
  passoutYear: z
    .string()
    .regex(/^\d{4}$/)
    .nonempty("Required")
    .transform((value) => parseInt(value)),
  college: z.string().nonempty(),
  branch: z.string().nonempty(),
});

export default function NewBatchForm() {
  const { toast } = useToast();

  const { data: collegeList } = usePermenantGet<College[]>(
    "/api/secure/colleges"
  );

  const { data: branches } = usePermenantGet<BranchListApiResponse[]>(
    "/api/secure/branches/all"
  );

  const { data: profile } = useProfile();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    form.reset({
      college: profile?.collegeId || "",
    });
  }, [form, profile]);

  function onSubmit(data: z.infer<typeof formSchema>) {
    axios
      .put("/api/secure/profile", data)
      .then((_res) => {
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
        });
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
                  <Input placeholder="Batch name" {...field} />
                </FormControl>
                <FormDescription>Enter batch name.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="passoutYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pass out year</FormLabel>
                <FormControl>
                  <Input placeholder="Year" {...field} />
                </FormControl>
                <FormDescription>Batch Passout year</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="branch"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="my-1">Branch / Programme</FormLabel>
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
                          ? branches?.find(
                              (language) => language.code === field.value
                            )?.name
                          : "Select Branch"}
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[600px] p-0" align="start">
                    <Command>
                      <CommandInput
                        placeholder="Search branches..."
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>No branch found.</CommandEmpty>
                        <CommandGroup>
                          {branches?.map((b) => (
                            <CommandItem
                              value={b.name}
                              key={b.code}
                              onSelect={() => {
                                form.setValue("branch", b.code);
                              }}
                            >
                              {b.name}
                              <CheckIcon
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  b.code === field.value
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
                <FormDescription>Select the branch</FormDescription>
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
                          ? collegeList?.find(
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
                          {collegeList?.map((college) => (
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
                <FormDescription>Select the college</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

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
