"use client";

import { FileInput, Label, Button } from "flowbite-react";
import { useState } from "react";
import { ResultType, convertToXlsx, formatData, parseCsv } from "./lib/main";
import toast from "react-hot-toast";
import { validateFileType, validateCSV } from "./lib/csvValidation";
import { writeFile } from "xlsx-js-style";

export default function Home() {
  const [file, setFile] = useState<File | undefined>(undefined);
  const [data, setData] = useState<ResultType[]>([]);
  const [isError, setIsError] = useState(false);
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
      toast.error(
        "Invalid file. " +
          validatedResult +
          ". Kindly send me this file so that I can fix this issue. Email: amjedmgm@gmail.com",
        {
          duration: 30000,
        }
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
    writeFile(convertToXlsx(formatData(data)), "result.xlsx");
    toast.success("File processed.");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <div>
          <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
            <h1 className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
              SBTE Tools
            </h1>
          </h1>
        </div>
        <div className="max-w-md" id="fileUpload">
          <div className="mb-2 block">
            <Label
              className="dark:text-gray-300 text-gray-400"
              htmlFor="file"
              value="Upload file"
            />
          </div>
          <FileInput
            aria-invalid={isError}
            color={isError ? "failure" : "success"}
            onChange={handleUpload}
            helperText={
              <p>
                Choose the file you recieved after unziping downloaded file.
                Don&apos;t select any modified file. Eg:{" "}
                <span className="font-semibold  underline  decoration-teal-500">
                  Dip R(21) E2023-01-00011.csv
                </span>
              </p>
            }
            id="file"
          />
        </div>
        <div className="my-2">
          <button onClick={handleProcess}>
            <Button>Process now</Button>
          </button>
        </div>
      </div>
      <div>
        <p className="text-center">
          Made by <strong>Amjed Ali K</strong>
        </p>
        <p className="text-xs text-center">GPTC Perinthalmanna</p>
      </div>
    </main>
  );
}
