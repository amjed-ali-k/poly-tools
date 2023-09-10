"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Dropzone from "react-dropzone";
import { Checkbox } from "@/components/ui/checkbox";
import { ResultType } from "@/app/lib/resultSorter/types";
import { validateCSV, validateFileType } from "@/app/lib/csvValidation";
import { formatData, parseCsv } from "@/app/lib/resultSorter/formatData";
import { writeFile } from "xlsx-js-style";
import { convertToXlsx } from "@/app/lib/main";
import { useToast } from "@/components/ui/use-toast";
import { Ban, FileSpreadsheet, UploadCloud } from "lucide-react";
import axios from "axios";

const allowedMonths = ["April", "November"];

const fomrSchema = z.object({
  month: z
    .string()
    .nonempty()
    .refine((val) => {
      return allowedMonths.includes(val);
    }),
  year: z
    .string()
    .nonempty()
    .regex(/^[0-9]{4}$/),
  upload: z.boolean(),
});

function ResultUploadForm() {
  const [file, setFile] = useState<File | undefined>(undefined);
  const [verifiedData, setData] = useState<ResultType[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof fomrSchema>>({
    resolver: zodResolver(fomrSchema),
    defaultValues: {
      month: "April",
      year: "2023",
      upload: true,
    },
  });

  const verifyAndFormatFile = async (e: File) => {
    setFile(undefined);

    if (!validateFileType(e)) {
      toast({
        title: "Invalid file type.",
        variant: "destructive",
        description:
          "File you uploaded is not a CSV file. Please upload a CSV file.",
      });
      console.log(
        "File you uploaded is not a CSV file. Please upload a CSV file.",
      );
      return;
    }

    setFile(e);

    const validatedResult = validateCSV(await e.text());
    if (validatedResult !== true) {
      toast({
        title: "Invalid file type.",
        variant: "destructive",
        description:
          "It seems you uploaded modified file. Please upload the original file.",
      });
      console.log(
        "It seems you uploaded modified file. Please upload the original file.",
      );
      return;
    }

    parseCsv(e, setData);
  };

  const handleProcess = async (data: z.infer<typeof fomrSchema>) => {
    if (!file || verifiedData.length === 0) {
      toast({
        title: "No files selected",
        variant: "destructive",
      });
      console.log("No files selected");
      return;
    }

    const formatedData = await formatData(verifiedData, true);
    writeFile(
      convertToXlsx(formatedData, {
        isCgpa: true,
        isImark: true,
        sortType: "registerNo",
      }),
      `SBTE Exam result (${data.month}-${data.year}).xlsx`,
    );

    toast({
      title: "File processed successfully.",
      description:
        "File is downloaded to your device. Open it with Excel or Google Sheets.",
    });

    if (data.upload) {
      axios
        .post("/api/secure/sbte-result/", {
          data: formatedData,
          month: data.month,
          year: data.year,
        })
        .then((res) => {
          console.log(res);
        });
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleProcess)} className="space-y-8">
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
                      <br /> Results won&apos;t be accurate if you upload
                      modified files.
                    </p>
                  </div>
                )}
                <input {...getInputProps()} />
              </div>
            )}
          </Dropzone>
          <section className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="month"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Month</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the exam month" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="April">April</SelectItem>
                      <SelectItem value="November">November</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Month of exam.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <FormControl>
                    <Input placeholder="Year" {...field} />
                  </FormControl>
                  <FormDescription>Year of exam</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>
          <FormField
            control={form.control}
            name="upload"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-4 ">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Save results</FormLabel>
                  <FormDescription>
                    Saved results will be available under student profiles. This
                    will help you to view aggregated result and progress of each
                    student.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          <Button role="button" type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default ResultUploadForm;
