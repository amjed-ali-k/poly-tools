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
import { Ban, FileSpreadsheet, Hash, UploadCloud, User } from "lucide-react";
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
import Link from "next/link";
import Papa from "papaparse";
import { Label } from "@/components/ui/label";
import Dropzone from "react-dropzone";
import axios from "axios";
import { StudentBatchForExam } from "@prisma/client";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

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
    .array(
      z.object({
        name: z.string().optional(),
        primaryNumber: z.string(),
        rollNumber: z.string().optional(),
        regNumber: z.string().optional(),
        admnNumber: z.string().optional(),
      })
    )
    .min(1),
});

function NewStudentBatchComponent() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
  });
  const { toast } = useToast();
  const router = useRouter();

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    axios
      .put<StudentBatchForExam>(
        "/api/secure/exam-seating/student-batches",
        data
      )
      .then((res) => {
        toast({
          title: "Well done!",
          description: `Class ${res.data.name} added successfully`,
        });
        router.push("/dashboard/tools/exam-seating/student-batches");
      })
      .catch((e) => {
        toast({
          title: "Error!",
          description: `Something went wrong`,
        });
      });
  };

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
        {modalType.current === "add-csv" && (
          <CsvModal
            onAdd={(e) => {
              form.setValue("students", [...students, ...e]);
              setIsOpen(false);
            }}
          />
        )}
        {modalType.current === "add-roll" && (
          <RollModal
            onAdd={(e) => {
              form.setValue("students", [...students, ...e]);
              setIsOpen(false);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

export default NewStudentBatchComponent;

const studentFormSchema = z
  .object({
    name: z.string(),
    rollNumber: z.string().optional(),
    regNumber: z.string().optional(),
    admnNumber: z.string().optional(),
  })
  .refine((data) => data.rollNumber || data.regNumber || data.admnNumber, {
    message: "Either any of number should be filled in.",
    path: ["rollNumber", "regNumber", "admnNumber"],
  });

type StudentType = z.infer<typeof formSchema>["students"][0];

function SingleModal({ onAdd }: { onAdd?: (data: StudentType) => void }) {
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
          <DialogTitle>Add student</DialogTitle>
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

type studentSchemaType = z.infer<typeof studentFormSchema>;

const parseCsv = (
  inputFile: File,
  onSuccess: (e: studentSchemaType[]) => void = (e) => console.log(e),
  onError: (e: string) => void = (e) => console.log(e)
) => {
  const reader = new FileReader();

  reader.onload = (event) => {
    if (!event.target) return;
    const file = event.target.result;
    if (typeof file !== "string") return;
    let allLines = file.split(/\r\n|\n/);
    // Reading line by line
    if (allLines.length < 2) {
      onError("File is empty");
      return;
    }
    Papa.parse<studentSchemaType>(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        onSuccess(results.data);
      },
    });
  };
};

function CsvModal({
  onAdd,
}: {
  onAdd?: (data: z.infer<typeof formSchema>["students"]) => void;
}) {
  const [error, seterror] = useState("");
  const verifyAndFormatFile = async (e: File) => {
    parseCsv(
      e,
      (k) => {
        onAdd?.(
          k.map((l) => ({
            ...l,
            primaryNumber: l.regNumber || l.rollNumber || l.admnNumber,
          }))
        );
      },
      seterror
    );
  };
  return (
    <>
      <DialogHeader>
        <DialogTitle>Add students from CSV</DialogTitle>
        <DialogDescription>
          Upload your csv file contianing student data here
        </DialogDescription>
      </DialogHeader>
      <div className="grid  @md:grid-cols-2 gap-4">
        <p className="text-sm text-gray-400">
          You can download a sample .csv file{" "}
          <Link
            className="hover:underline font-bold !text-indigo-400"
            href="/student-sample.csv"
          >
            from here
          </Link>
          . Modifying and re-uploading it is recommeneded. You can also try to
          create your own csv file. We only look for headers{" "}
          <strong className="text-gray-300">
            name, rollNumber, regNumber, admnNumber
          </strong>
          .
        </p>
        <Dropzone
          multiple={false}
          accept={{
            "text/csv": [".csv"],
          }}
          onDrop={(acceptedFiles) => {
            verifyAndFormatFile(acceptedFiles[0]);
          }}
        >
          {({ getRootProps, getInputProps, acceptedFiles, isDragReject }) => (
            <div
              {...getRootProps()}
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-slate-900 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              {acceptedFiles.length > 0 ? (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FileSpreadsheet className="w-10 h-10 mb-1 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 font-bold dark:text-gray-400">
                    {acceptedFiles[0].name}
                  </p>
                  <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className=" ">Click to upload another file</span> or
                    drag and drop
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {isDragReject ? (
                    <>
                      <Ban className="w-10 h-10 mb-3 text-red-500 dark:text-red-400" />
                      <p className="mb-2 text-sm text-red-500 dark:text-red-400">
                        <span className="font-semibold">
                          File format not supported
                        </span>
                      </p>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-10 h-10 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                    </>
                  )}
                  <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                    CSV files only.
                    <br /> Results won&apos;t be accurate if you upload modified
                    files.
                  </p>
                </div>
              )}
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      </div>
      {error !== "" && <p className="text-red-500 text-sm">{error}</p>}
      <Button role="button" type="submit">
        Add students
      </Button>
    </>
  );
}

const rollFormSchema = z.object({
  start: z.string().optional(),
  end: z.string().optional(),
  exclude: z
    .string()
    .optional()
    .refine(
      (e) => {
        if (!e) return true;
        return e.split(",").every((e) => !isNaN(parseInt(e)));
      },
      {
        message: "Please enter a valid numbers seperated by comma",
      }
    ),
  prefix: z.string().optional(),
});

function RollModal({
  onAdd,
}: {
  onAdd?: (data: z.infer<typeof formSchema>["students"]) => void;
}) {
  const form = useForm<z.infer<typeof rollFormSchema>>({
    resolver: zodResolver(rollFormSchema),
    defaultValues: {
      start: "",
      end: "",
      prefix: "",
      exclude: "",
    },
  });

  const onSubmit = (data: z.infer<typeof rollFormSchema>) => {
    const students: StudentType[] = [];
    if (data.start && data.end) {
      const start = parseInt(data.start);
      const end = parseInt(data.end);
      const exclude = data.exclude?.split(",").map((e) => parseInt(e));
      for (let i = start; i <= end; i++) {
        if (exclude?.includes(i)) continue;
        students.push({
          name: `${data.prefix || ""}${i}`,
          rollNumber: i.toString(),
          primaryNumber: i.toString(),
        });
      }
    }
    onAdd?.(students);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 @container"
      >
        <DialogHeader>
          <DialogTitle>Add student</DialogTitle>
          <DialogDescription>Enter student details here</DialogDescription>
        </DialogHeader>
        <div className="grid  @md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="start"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Starting roll no</FormLabel>
                <FormControl>
                  <Input placeholder="1" {...field} />
                </FormControl>
                <FormDescription>Enter starting roll number.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="end"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ending roll no</FormLabel>
                <FormControl>
                  <Input placeholder="66" {...field} />
                </FormControl>
                <FormDescription>Enter ending roll number.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="exclude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Roll no.s to exclude</FormLabel>
                <FormControl>
                  <Input placeholder="24,31,43" {...field} />
                </FormControl>
                <FormDescription>
                  Enter numbers seperated by comma
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="prefix"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prefix</FormLabel>
                <FormControl>
                  <Input placeholder="EL-" {...field} />
                </FormControl>
                <FormDescription>
                  Enter prefix to add with roll no as name
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
