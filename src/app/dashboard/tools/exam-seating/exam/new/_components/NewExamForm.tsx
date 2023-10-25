"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { toast } from "@/components/ui/use-toast";
import { usePermenantGet } from "@/lib/swr";
import {
  ExamHall,
  StudentBatchForExam,
  Subject,
  SubjectType,
} from "@prisma/client";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { CommandLoading } from "cmdk";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

const schema = z.object({
  hallId: z.string().uuid(),
  searchInput: z.string().optional(),
});

function AddHallsSection() {
  const { data: hallList, isLoading } = usePermenantGet<ExamHall[]>(
    "/api/secure/exam-seating/all"
  );
  const [finalHalls, setfinalHalls] = useState<ExamHall[]>([]);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  function onSubmit(data: z.infer<typeof schema>) {
    const hall = hallList?.find((hl) => hl.id === data.hallId);
    if (finalHalls.find((h) => h.id === hall?.id))
      return toast({
        title: "Hall already added",
        description: "You have already added this hall.",
        variant: "destructive",
      });

    if (!hall) return;

    setfinalHalls([...finalHalls, hall]);
    toast({
      title: "Hall added!",
      description: `Hall ${hall?.name} is successfully added`,
    });
  }

  const [open, setOpen] = React.useState(false);

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="w-full lg:w-2/5">
            <CardContent className="grid gap-4 pt-4">
              <FormField
                control={form.control}
                name="hallId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="my-1">Exam Hall</FormLabel>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className={cn(
                              "min-w-[340px] justify-between truncate whitespace-nowrap flex-nowrap overflow-hidden",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? hallList?.find((hl) => hl.id === field.value)
                                  ?.name
                              : "Select Hall"}
                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-0" align="start">
                        <Command>
                          <CommandInput
                            placeholder="Search halls..."
                            className="h-9"
                          />
                          <CommandList>
                            {isLoading && (
                              <CommandLoading>
                                <div className="py-2 px-4">Hang on…</div>
                              </CommandLoading>
                            )}

                            <CommandEmpty>No hall found.</CommandEmpty>
                            <CommandGroup>
                              {hallList?.map((hall) => (
                                <CommandItem
                                  value={hall.id}
                                  key={hall.id}
                                  onSelect={() => {
                                    form.setValue("hallId", hall.id);
                                    setOpen(false);
                                  }}
                                >
                                  {hall.name}
                                  <CheckIcon
                                    className={cn(
                                      "ml-auto h-4 w-4",
                                      hall.id === field.value
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
                      Select a class/hall to use in current exam. You can create
                      new hall{" "}
                      <Link
                        href="/dashboard/tools/exam-seating/new-class"
                        className="font-bold text-violet-500 inline-block hover:text-fuchsia-400 cursor-pointer"
                      >
                        from here.
                      </Link>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" variant="secondary">
                Add hall
              </Button>
            </CardContent>
          </Card>
        </form>
      </Form>
      <div>
        <h5 className="text-lg font-bold mt-5">Selected halls</h5>

        <Table className="mt-3">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="w-[150px]">Common seats</TableHead>
              <TableHead className="w-[150px]">Theory only seats</TableHead>
              <TableHead className="w-[150px]">Drawing only seats</TableHead>
              <TableHead className="w-[150px] text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {finalHalls.length < 1 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  No halls added
                </TableCell>
              </TableRow>
            )}
            {finalHalls.map((hl) => (
              <TableRow className="group" key={hl.id}>
                <TableCell className="font-medium">{hl.name}</TableCell>
                <TableCell>{hl.commonSeats}</TableCell>
                <TableCell>{hl.theoryOnlySeats}</TableCell>
                <TableCell>{hl.drawingOnlySeats}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="link"
                    className="opacity-0 group-hover:opacity-100 text-red-600"
                    onClick={() => {
                      setfinalHalls(finalHalls.filter((h) => h.id !== hl.id));
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <section className="my-2">
        <Button disabled={finalHalls.length === 0}>
          Generate seating arrangements
        </Button>
      </section>
    </div>
  );
}

const batchSchema = z.object({
  batchId: z.string().uuid(),
  subject: z
    .object({
      name: z.string(),
      code: z.string(),
    })
    .strip(),
  type: z
    .string()
    .refine(
      (e) => ["THEORY", "DRAWING"].includes(e),
      "Type should be Theory or Drawing"
    ),
});

type BatchIdWithSubjectType = z.infer<typeof batchSchema>;

type BatchWithSub = StudentBatchForExam & BatchIdWithSubjectType;

function AddBatchesSection() {
  const { data: batchList, isLoading } = usePermenantGet<StudentBatchForExam[]>(
    "/api/secure/exam-seating/student-batches/all"
  );

  const { data: subjects, isLoading: isSubsLoading } = usePermenantGet<
    Subject[]
  >("/api/secure/subjects/all");

  const [finalBatches, setfinalBatches] = useState<BatchWithSub[]>([]);

  const form = useForm<BatchIdWithSubjectType>({
    resolver: zodResolver(batchSchema),
  });

  function onSubmit(data: BatchIdWithSubjectType) {
    if (finalBatches.find((h) => h.batchId === data.batchId))
      return toast({
        title: "Batch already added",
        description: "You have already added this batch.",
        variant: "destructive",
      });
    const batch = batchList?.find((e) => e.id === data.batchId);
    if (!batch) return;

    setfinalBatches([...finalBatches, { ...batch, ...data }]);
    toast({
      title: "Batch added!",
      description: `Batch ${batch?.name} is successfully added for ${data.subject.name}`,
    });
  }

  const [open, setOpen] = React.useState(false);
  const [subopen, setsubOpen] = React.useState(false);

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="w-full ">
            <CardContent>
              <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3 pt-4">
                <FormField
                  control={form.control}
                  name="batchId"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="my-1">Student Batch</FormLabel>
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={open}
                              className={cn(
                                "min-w-[340px] justify-between truncate whitespace-nowrap flex-nowrap overflow-hidden",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? batchList?.find((bt) => bt.id === field.value)
                                    ?.name
                                : "Select Batch"}
                              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0" align="start">
                          <Command>
                            <CommandInput
                              placeholder="Search batches..."
                              className="h-9"
                            />
                            <CommandList>
                              {isLoading && (
                                <CommandLoading>
                                  <div className="py-2 px-4">Hang on…</div>
                                </CommandLoading>
                              )}

                              <CommandEmpty>No batch found.</CommandEmpty>
                              <CommandGroup>
                                {batchList?.map((batch) => (
                                  <CommandItem
                                    value={batch.id}
                                    key={batch.id}
                                    onSelect={() => {
                                      form.setValue("batchId", batch.id);
                                      setOpen(false);
                                    }}
                                  >
                                    {batch.name}
                                    <CheckIcon
                                      className={cn(
                                        "ml-auto h-4 w-4",
                                        batch.id === field.value
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
                        Select a batch to use in current exam. You can create
                        new batch{" "}
                        <Link
                          href="/dashboard/tools/exam-seating/student-batches/new"
                          className="font-bold text-violet-500 inline-block hover:text-fuchsia-400 cursor-pointer"
                        >
                          from here.
                        </Link>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="my-1">Subject</FormLabel>
                      <Popover open={subopen} onOpenChange={setsubOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={subopen}
                              className={cn(
                                "min-w-[340px] justify-between truncate whitespace-nowrap flex-nowrap overflow-hidden",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? subjects?.find(
                                    (sb) => sb.code === field.value?.code
                                  )?.name
                                : "Select subject"}
                              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0" align="start">
                          <Command>
                            <CommandInput
                              placeholder="Search halls..."
                              className="h-9"
                            />
                            <CommandList>
                              {isSubsLoading && (
                                <CommandLoading>
                                  <div className="py-2 px-4">Hang on…</div>
                                </CommandLoading>
                              )}

                              <CommandEmpty>No subjects found.</CommandEmpty>
                              <CommandGroup>
                                {subjects?.map((sub) => (
                                  <CommandItem
                                    value={sub.code}
                                    key={sub.code}
                                    onSelect={() => {
                                      form.setValue("subject", sub);
                                      form.setValue(
                                        "type",
                                        SubjectType[sub.type]
                                      );
                                      setsubOpen(false);
                                    }}
                                  >
                                    {sub.name}
                                    <CheckIcon
                                      className={cn(
                                        "ml-auto h-4 w-4",
                                        sub.code === field.value?.code
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
                        Select examination subject
                        {/* <Link
                        href="/dashboard/tools/exam-seating/new-class"
                        className="font-bold text-violet-500 inline-block hover:text-fuchsia-400 cursor-pointer"
                      >
                        from here.
                      </Link> */}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        //   defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Subject Type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={SubjectType[SubjectType.THEORY]}>
                            Theory
                          </SelectItem>
                          <SelectItem value={SubjectType[SubjectType.DRAWING]}>
                            Drawing
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Select subject type</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="mt-4 w-64" variant="secondary">
                Add batch
              </Button>
            </CardContent>
          </Card>
        </form>
      </Form>
      <div>
        <h5 className="text-lg font-bold mt-5">Selected batches</h5>
        <Table className="mt-3">
          <TableHeader>
            <TableRow>
              <TableHead>Batch name</TableHead>
              <TableHead className="">Subject</TableHead>
              <TableHead className="w-[150px]">Type</TableHead>
              <TableHead className="w-[150px]">Total Students</TableHead>
              <TableHead className="w-[50px] text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {finalBatches.length < 1 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  No batches added
                </TableCell>
              </TableRow>
            )}
            {finalBatches.map((bt) => (
              <TableRow className="group" key={bt.id}>
                <TableCell className="font-medium">{bt.name}</TableCell>
                <TableCell className="font-medium">{bt.subject.name}</TableCell>
                <TableCell className="font-medium">{bt.type}</TableCell>
                <TableCell>{bt.studentsCount}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="link"
                    className="opacity-0 group-hover:opacity-100 text-red-600"
                    onClick={() => {
                      setfinalBatches(
                        finalBatches.filter((h) => h.id !== bt.id)
                      );
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <section className="my-2">
        <Button disabled={finalBatches.length === 0}>Submit</Button>
      </section>
    </div>
  );
}
export default AddBatchesSection;
