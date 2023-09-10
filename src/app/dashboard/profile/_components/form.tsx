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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { CheckIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const fomrSchema = z.object({
  phone: z
    .string()
    .nonempty()
    .regex(/^[0-9]{10}$/),
  bio: z.string(),
  name: z.string().nonempty(),
  college: z.string().nonempty(),
  image: z.string().url(),

  links: z.object({
    instagram: z.string().url(),
    linkedin: z.string().url(),
    github: z.string().url(),
    facebook: z.string().url(),
    twitter: z.string().url(),
    threads: z.string().url(),
    telegram: z.string().url(),
  }),
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

  const form = useForm<z.infer<typeof fomrSchema>>({
    resolver: zodResolver(fomrSchema),
    defaultValues: {},
  });

  function onSubmit(data: z.infer<typeof fomrSchema>) {
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="college"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>College</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[400px] justify-between truncate whitespace-nowrap flex-nowrap overflow-hidden",
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
        <Button role="button" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}
