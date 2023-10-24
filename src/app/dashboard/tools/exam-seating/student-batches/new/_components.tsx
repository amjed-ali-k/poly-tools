"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Hash, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const formSchema: z.ZodType<{
  name: string;
  students: {
    name?: string | undefined;
    rollNumber?: string | undefined;
    regNumber?: string | undefined;
    admnNumber?: string | undefined;
    primaryNumber?: string | undefined;
  }[];
}> = z.object({
  name: z.string().min(3, "Minimum 3 characters required"),
  students: z
    .array({
      //@ts-ignore
      name: z.string().optional(),
      primaryNumber: z.string(),
      rollNumber: z.string().optional(),
      regNumber: z.string().optional(),
      admnNumber: z.string().optional(),
    })
    .min(1),
});

function NewStudentBatchComponent() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {};

  const [isOpen, setIsOpen] = useState(false);
  const modalType = useRef<"add-student" | "add-roll" | "add-csv">(
    "add-student"
  );
  const students = form.watch("students") || [];
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <section className="grid  md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem aria-required>
                  <FormLabel>Batch name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormDescription>Enter batch name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>
          <section className="w-full">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Add new student(s)</Button>
              </DropdownMenuTrigger>
              <DialogTrigger>
                <DropdownMenuContent
                  side="right"
                  align="start"
                  className="w-64"
                >
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => (modalType.current = "add-student")}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Add single
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => (modalType.current = "add-roll")}
                    >
                      <Hash className="mr-2 h-4 w-4" />
                      Add from Roll No / Reg No
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => (modalType.current = "add-csv")}
                    >
                      <FileSpreadsheet className="mr-2 h-4 w-4" />
                      Add from CSV
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DialogTrigger>
            </DropdownMenu>
            {students.length < 1 && (
              <div className="border-dashed p-8 mt-3 w-full flex items-center justify-center border rounded-xl text-gray-400">
                <div className="text-center">
                  <User className="w-14 h-14 mb-2 mx-auto" />
                  No students added
                </div>
              </div>
            )}

            {students.length > 0 && (
              <Table className="mt-3">
                <TableCaption>A list of students you added.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="w-[100px]">Reg No</TableHead>
                    <TableHead className="w-[100px]">Roll No</TableHead>
                    <TableHead className="w-[100px]">Admn No</TableHead>
                    <TableHead className="w-[100px]">Display No</TableHead>
                    <TableHead className="w-[150px] text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow className="group" key={student.primaryNumber}>
                      <TableCell className="font-medium">
                        {student.name}
                      </TableCell>
                      <TableCell>{student.regNumber}</TableCell>
                      <TableCell>{student.rollNumber}</TableCell>
                      <TableCell>{student.admnNumber}</TableCell>

                      <TableCell>{student.primaryNumber}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="link"
                          className="opacity-0 group-hover:opacity-100 text-red-600"
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </section>
          <Button
            role="button"
            disabled={form.formState.isSubmitting}
            type="submit"
          >
            Add batch
          </Button>
        </form>
      </Form>
      <DialogContent className="sm:min-w-[425px]">
        {modalType.current === "add-student" && (
          <SingleModal
            onAdd={(e) => {
              form.setValue("students", [...students, e]);
              setIsOpen(false);
            }}
          />
        )}
        {modalType.current === "add-csv" && <CsvModal />}
      </DialogContent>
    </Dialog>
  );
}

export default NewStudentBatchComponent;

const studentFormSchema = z
  .object({
    name: z.string().optional(),
    rollNumber: z.string().optional(),
    regNumber: z.string().optional(),
    admnNumber: z.string().optional(),
  })
  .refine((data) => data.rollNumber || data.regNumber || data.admnNumber, {
    message: "Either any of number should be filled in.",
    path: ["rollNumber", "regNumber", "admnNumber"],
  });

function SingleModal({
  onAdd,
}: {
  onAdd?: (data: z.infer<typeof formSchema>["students"][0]) => void;
}) {
  const form = useForm<z.infer<typeof studentFormSchema>>({
    resolver: zodResolver(studentFormSchema),
  });

  const onSubmit = (data: z.infer<typeof studentFormSchema>) => {
    onAdd?.({
      ...data,
      primaryNumber: data.regNumber || data.rollNumber || data.admnNumber,
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 @container"
      >
        <DialogHeader>
          <DialogTitle>Add students</DialogTitle>
          <DialogDescription>Enter student details here</DialogDescription>
        </DialogHeader>
        <div className="grid  @md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Student Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} />
                </FormControl>
                <FormDescription>Enter student full name.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rollNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Roll No</FormLabel>
                <FormControl>
                  <Input placeholder="Roll no" {...field} />
                </FormControl>
                <FormDescription>
                  Enter student roll number. (optional field)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="regNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Register number</FormLabel>
                <FormControl>
                  <Input placeholder="Reg no" {...field} />
                </FormControl>
                <FormDescription>
                  Enter student register number. (optional field)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="admnNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Admission number</FormLabel>
                <FormControl>
                  <Input placeholder="Admn no" {...field} />
                </FormControl>
                <FormDescription>
                  Enter student admission number. (optional field)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          role="button"
          disabled={form.formState.isSubmitting}
          type="submit"
        >
          Add student
        </Button>
      </form>
    </Form>
  );
}

const csvFormSchema = z.object({
  csvFile: z.string().refine((data) => data.endsWith(".csv"), {
    message: "Only CSV file is allowed.",
  }),
});

function CsvModal({
  onAdd,
}: {
  onAdd?: (data: z.infer<typeof formSchema>["students"]) => void;
}) {
  const form = useForm<z.infer<typeof csvFormSchema>>({
    resolver: zodResolver(csvFormSchema),
  });

  const onSubmit = (data: z.infer<typeof csvFormSchema>) => {};

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 @container"
      >
        <DialogHeader>
          <DialogTitle>Add students from CSV</DialogTitle>
          <DialogDescription>
            Upload your csv file contianing student data here
          </DialogDescription>
        </DialogHeader>
        <div className="grid  @md:grid-cols-2 gap-4">
          <p className="text-sm text-gray-400">
            You can download a sample .csv file from here. Modifying and
            re-uploading it is recommeneded. You can also try to create your own
            csv file. We only look for headers{" "}
            <strong>name, rollNumber, regNumber, admnNumber</strong>.
          </p>
          <FormField
            control={form.control}
            name="csvFile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Upload csv file</FormLabel>
                <FormControl>
                  <Input type="file" placeholder="Name" {...field} />
                </FormControl>
                <FormDescription>
                  Choose a .csv file in given format
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          role="button"
          disabled={form.formState.isSubmitting}
          type="submit"
        >
          Add students
        </Button>
      </form>
    </Form>
  );
}
