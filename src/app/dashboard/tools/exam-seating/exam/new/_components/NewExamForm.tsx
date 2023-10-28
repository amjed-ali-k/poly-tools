"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle2,
  CheckIcon,
  Diamond,
  PlayCircle,
  Users,
  X,
} from "lucide-react";
import React, { useMemo, useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sum, flat, group, sift } from "radash";
import { assignHallsCustom } from "@/lib/examTools/customHallAsiign";
import { AllocatedSeat, allocateSeats } from "@/lib/examTools/hallSort";
import { SeatObjectType } from "../../../new-class/_components/newClass";
import { GenerateHallsAssignment, GenerateSeatArrangements } from "./PDFgen";

type tabsType = "batches-section" | "halls-section" | "generate-section";

function CreateExamFrom() {
  const [finalHalls, setfinalHalls] = useState<ExamHall[]>([]);
  const [finalBatches, setfinalBatches] = useState<BatchWithSub[]>([]);

  const counts = useMemo(
    () => ({
      drawing: sum(
        finalBatches.filter((e) => e.type === "DRAWING"),
        (e) => e.studentsCount
      ),
      theory: sum(
        finalBatches.filter((e) => e.type === "THEORY"),
        (e) => e.studentsCount
      ),
    }),
    [finalBatches]
  );

  const [tab, settab] = useState<tabsType>("batches-section");
  return (
    <div>
      <div className="max-w-sm"></div>
      <Tabs value={tab} defaultValue="batches-section" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="batches-section">1. Batches</TabsTrigger>
          <TabsTrigger value="halls-section">2. Halls</TabsTrigger>
          <TabsTrigger value="generate-section">3. Generate</TabsTrigger>
        </TabsList>
        <TabsContent className="py-4" value="batches-section">
          <AddBatchesSection
            finalBatches={finalBatches}
            setfinalBatches={setfinalBatches}
            onSuccess={() => settab("halls-section")}
          />
        </TabsContent>
        <TabsContent className="py-4" value="halls-section">
          <AddHallsSection
            studentCount={counts}
            finalHalls={finalHalls}
            setfinalHalls={setfinalHalls}
            onSuccess={() => settab("generate-section")}
          />
        </TabsContent>
        <TabsContent value="generate-section">
          <GenerateSection
            finalBatches={finalBatches}
            finalHalls={finalHalls}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default CreateExamFrom;

type IncomeStudent = {
  name?: string | undefined;
  rollNumber?: string | undefined;
  regNumber?: string | undefined;
  admnNumber?: string | undefined;
  primaryNumber?: string | undefined;
};

export type ArrangedResult = {
  hall: string;
  hallName: string;
  hallStructure: SeatObjectType[][];
  seats: AllocatedSeat[];
};

function GenerateSection({
  finalHalls,
  finalBatches,
}: {
  finalHalls: ExamHall[];
  finalBatches: BatchWithSub[];
}) {
  const seats = useMemo(() => {
    const assignedHalls = assignHallsCustom(
      finalBatches.map((e) => ({
        count: e.studentsCount,
        subjectCode: parseInt(e.subject.code),
        examType: e.type === "THEORY" ? 0 : 1,
      })),
      finalHalls.map((e) => ({
        name: e.id,
        commonSeats: e.commonSeats,
        theoryOnlySeats: e.theoryOnlySeats,
        drawingOnlySeats: e.drawingOnlySeats,
      }))
    );

    const remainingStudents = group(
      flat(
        finalBatches.map((e) => {
          const st = e.students as IncomeStudent[];
          const students = st.map((k) => ({
            batchId: e.batchId,
            batchName: e.name,
            regNo: (k.name || k.primaryNumber)!,
            subjectCode: parseInt(e.subject.code),
            examType: e.type === "THEORY" ? 0 : 1,
            ...k,
          }));
          return students;
        })
      ),
      (e) => e.subjectCode
    );

    const indexes: { [key: string]: number } = {};
    const seats = sift(
      Object.keys(assignedHalls).map((e) => {
        const hall = assignedHalls[e];
        const ogHall = finalHalls.find((k) => k.id === e);
        const subjectCodes = Object.keys(assignedHalls[e]);

        const students: ({
          regNo: string;
          subjectCode: number;
          examType: number;
          batchId: string;
          batchName: string;
        } & IncomeStudent)[] = [];
        // console.log(remainingStudents);
        subjectCodes.map((subCode) => {
          if (indexes[subCode] === undefined) indexes[subCode] = 0;
          const count = hall[parseInt(subCode)];
          //   console.log(
          //     `${count} students assigned from ${subCode} in Hall ${ogHall?.name}, Index start from ${indexes[subCode]}`
          //   );
          const toAdd = remainingStudents[parseInt(subCode)]?.slice(
            indexes[subCode],
            indexes[subCode] + count
          );
          //   console.log(indexes);
          indexes[subCode] += count;
          console.log(indexes);
          if (!toAdd) return;
          students.push(...toAdd);
        });
        if (!ogHall?.structure) return;

        const seatType = (ogHall.structure as SeatObjectType[][]).map((e) =>
          flat(e.map((k) => k.structure))
        );

        // console.log("Structure", ogHall.structure);
        return {
          hall: ogHall.id,
          hallName: ogHall.name,
          hallStructure: ogHall.structure,
          seats: allocateSeats(students, seatType as any),
        };
      })
    );
    // console.log(seats);
    return seats;
  }, [finalBatches, finalHalls]);

  return (
    <div className="flex flex-col gap-4">
      <GenerateSeatArrangements seats={seats as any} />
      <GenerateHallsAssignment seats={seats as any} />
    </div>
  );
}

const schema = z.object({
  hallId: z.string().uuid(),
  searchInput: z.string().optional(),
});

function AddHallsSection({
  finalHalls,
  setfinalHalls,
  onSuccess,
  studentCount,
}: {
  finalHalls: ExamHall[];
  setfinalHalls: (e: ExamHall[]) => void;
  onSuccess: () => void;
  studentCount: {
    drawing: number;
    theory: number;
  };
}) {
  const { data: hallList, isLoading } = usePermenantGet<ExamHall[]>(
    "/api/secure/exam-seating/all"
  );

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

  const diff = useMemo(() => {
    const { theoryOnlySeats, drawingOnlySeats, commonSeats } =
      finalHalls.reduce(
        (acc, curr) => {
          acc.theoryOnlySeats += curr.theoryOnlySeats;
          acc.drawingOnlySeats += curr.drawingOnlySeats;
          acc.commonSeats += curr.commonSeats;
          return acc;
        },
        { theoryOnlySeats: 0, drawingOnlySeats: 0, commonSeats: 0 }
      );
    const theorydiff = Math.abs(
      theoryOnlySeats - studentCount.theory < 0
        ? theoryOnlySeats - studentCount.theory
        : 0
    );
    const drawingdiff = Math.abs(
      drawingOnlySeats - studentCount.drawing < 0
        ? drawingOnlySeats - studentCount.drawing
        : 0
    );
    const diff = Math.abs(
      commonSeats - (theorydiff + drawingdiff) < 0
        ? commonSeats - (theorydiff + drawingdiff)
        : 0
    );
    return diff;
  }, [finalHalls, studentCount.drawing, studentCount.theory]);
  const assigned = studentCount.drawing + studentCount.theory - diff;
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="w-full">
            <CardContent className="grid gap-4 pt-4">
              <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3 pt-4">
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
                        Select a class/hall to use in current exam. You can
                        create new hall{" "}
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
                {finalHalls.length > 0 && (
                  <div className="py-4 pl-8">
                    {
                      <div className="flex text-green-500 mb-2">
                        <CheckIcon className="mr-2" />
                        {assigned} Students can be assigned
                      </div>
                    }
                    {diff > 0 && (
                      <div className="flex text-red-500">
                        <X className="mr-2" /> {diff} Students dont have seats
                      </div>
                    )}
                  </div>
                )}
              </div>
              <Button type="submit" className="mt-4 w-64" variant="secondary">
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
                <TableCell colSpan={5}>
                  <div className="flex flex-col items-center justify-center py-6">
                    <Diamond className="block mb-2" />
                    No halls added
                  </div>
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
        <Button disabled={finalHalls.length === 0} onClick={onSuccess}>
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

function AddBatchesSection({
  finalBatches,
  setfinalBatches,
  onSuccess,
}: {
  finalBatches: BatchWithSub[];
  setfinalBatches: (e: BatchWithSub[]) => void;
  onSuccess: () => void;
}) {
  const { data: batchList, isLoading } = usePermenantGet<StudentBatchForExam[]>(
    "/api/secure/exam-seating/student-batches/all"
  );

  const { data: subjects, isLoading: isSubsLoading } = usePermenantGet<
    Subject[]
  >("/api/secure/subjects/all");

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
                                    value={sub.name}
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
                <TableCell colSpan={5}>
                  <div className="flex flex-col items-center justify-center py-6">
                    <Users className="block mb-2" />
                    No batches added
                  </div>
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
        <Button disabled={finalBatches.length === 0} onClick={onSuccess}>
          Submit
        </Button>
      </section>
    </div>
  );
}
