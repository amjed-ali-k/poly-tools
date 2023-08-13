"use client";
import React from "react";
import { FileInput, Label, Button } from "flowbite-react";
import { useState } from "react";

import toast from "react-hot-toast";

import { writeFile } from "xlsx-js-style";
import { validateFileType, validateCSV } from "@/app/lib/csvValidation";
import {
  ResultType,
  parseCsv,
  convertToXlsx,
  formatData,
} from "@/app/lib/main";
import axios from "axios";

function FileUpload() {
  const [file, setFile] = useState<File | undefined>(undefined);
  const [data, setData] = useState<ResultType[]>([]);
  const [isError, setIsError] = useState<boolean>();
  const handleUpload: React.ChangeEventHandler<HTMLInputElement> = async (
    e
  ) => {
    if (!e.target.files) return;
    setIsError(true);
    if (!validateFileType(e.target.files[0])) {
      toast.error("Invalid file type.");
      return;
    }

    setFile(e.target.files[0]);

    const validatedResult = validateCSV(await e.target.files[0].text());
    if (validatedResult !== true) {
      toast.error(validatedResult);
      toast.error(
        "Kindly send me this file so that I can fix this issue. Email: amjedmgm@gmail.com",
        { duration: 15e3 }
      );
      return;
    }
    setIsError(false);
    parseCsv(e.target.files[0], setData);
  };

  const handleProcess = async () => {
    if (!file || data.length === 0) {
      toast.error("No files selected.");
      return;
    }
    const formatedData = formatData(data);
    writeFile(convertToXlsx(formatedData), "result.xlsx");

    const totalRegular = formatedData.filter(
      (item) => item.examType === "Regular"
    ).length;
    const totalStudents = formatedData.length;
    const totalSupplimentry = totalStudents - totalRegular;

    axios
      .put("/api/count/", {
        totalStudents,
        totalSupplimentry,
        totalRegular,
        fileName: file.name,
      })
      .catch((err) => {});

    toast.success("File processed.");
  };
  return (
    <>
      <div className="max-w-md" id="fileUpload">
        <div className="mb-2 block">
          <Label
            className="dark:text-gray-300 font-bold text-gray-400"
            htmlFor="file"
            value="Upload file"
          />
          <p className="text-xs my-2 font-extralight text-gray-300">
            Choose the csv file you recieved from SBTE Website. Don&apos;t
            select any modified file. Eg:{" "}
            <span className="font-semibold  underline  decoration-teal-500">
              Dip R(21) E2023-01-00011.csv
            </span>
          </p>
        </div>
        <FileInput
          aria-invalid={isError}
          color={isError ? "failure" : "success"}
          onChange={handleUpload}
          helperText={isError && "Invalid file type."}
          id="file"
        />
      </div>
      <div className="my-3">
        <Button
          onClick={handleProcess}
          gradientDuoTone="purpleToPink"
          disabled={isError}
        >
          Process now
        </Button>
      </div>
    </>
  );
}

export default FileUpload;
