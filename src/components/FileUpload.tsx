"use client";
import React from "react";
import {
  FileInput,
  Label,
  Button,
  Checkbox,
  Badge,
  TextInput,
} from "flowbite-react";
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
import { HiPhone } from "react-icons/hi2";

function FileUpload() {
  const [file, setFile] = useState<File | undefined>(undefined);
  const [data, setData] = useState<ResultType[]>([]);

  const [errors, setErrors] = useState({
    file: false,
    phone: false,
  });

  const setError = (label: keyof typeof errors) => {
    setErrors({ ...errors, [label]: true });
  };
  const clearError = (label: keyof typeof errors) => {
    setErrors({ ...errors, [label]: false });
  };

  const [formData, setFormData] = useState<{
    isImark: boolean;
    isCgpa: boolean;
    phone?: string;
  }>({
    isImark: true,
    isCgpa: false,
    phone: undefined,
  });
  const handleUpload: React.ChangeEventHandler<HTMLInputElement> = async (
    e
  ) => {
    setFile(undefined);
    if (!e.target.files) return;
    if (e.target.files.length === 0) return;
    if (!validateFileType(e.target.files[0])) {
      toast.error("Invalid file type.");
      setError("file");
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
      setError("file");
      return;
    }
    clearError("file");
    parseCsv(e.target.files[0], setData);
  };

  const handleProcess = async () => {
    if (!file || data.length === 0) {
      setError("file");
      toast.error("No files selected.");
      return;
    }
    if (formData.isCgpa) {
      const { phone } = formData;
      if (!phone) {
        setError("phone");
        return;
      }

      if (phone?.length !== 10 || !isNumeric(phone)) {
        setError("phone");
        return;
      }
    }
    clearError("phone");
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
    <form>
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
          aria-invalid={errors.file}
          color={errors.file ? "failure" : "success"}
          onChange={handleUpload}
          helperText={errors.file && "Invalid file type."}
          id="file"
        />
      </div>
      <div className="flex max-w-md flex-col gap-4 my-4" id="checkbox">
        <div className="flex items-center gap-2">
          <Checkbox
            defaultChecked
            checked={formData.isImark}
            onChange={(e) =>
              setFormData({ ...formData, isImark: e.target.checked })
            }
            id="imark"
          />
          <Label htmlFor="imark" className="text-white">
            Include Internal mark{" "}
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            defaultChecked={false}
            checked={formData.isCgpa}
            onChange={(e) =>
              setFormData({ ...formData, isCgpa: e.target.checked })
            }
            id="cgpa"
          />
          <Label htmlFor="cgpa" className="text-white">
            Include CGPA of each student{" "}
            <span className=" ml-2 bg-yellow-100 text-yellow-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">
              Phone required
            </span>
          </Label>
        </div>
        {formData.isCgpa && (
          <div>
            <div className="mb-2 block">
              <Label htmlFor="phone" value="Your phone number" />
            </div>
            <TextInput
              id="phone"
              aria-invalid={errors.phone}
              helperText={errors.phone && "Phone number invalid"}
              color={errors.phone ? "failure" : "success"}
              icon={HiPhone}
              placeholder="9XXXX XXXXXX"
              required={formData.isCgpa}
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              min={10}
              max={10}
            />
          </div>
        )}
      </div>

      <div className="my-3">
        <Button
          onClick={handleProcess}
          gradientDuoTone="purpleToPink"
          disabled={errors.file || !file}
        >
          Process now
        </Button>
      </div>
    </form>
  );
}

export default FileUpload;

function isNumeric(value: string) {
  return /^-?\d+$/.test(value);
}
