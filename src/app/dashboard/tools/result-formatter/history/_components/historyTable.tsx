"use client";

import * as React from "react";
import dayjs from "dayjs";

import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGet } from "@/lib/swr";
import { ExamResultHistoryApiType } from "@/app/api/secure/sbte-result/history/route";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { mutate } from "swr";
import { ExamResultSingleApiType } from "@/app/api/secure/sbte-result/single/[resultId]/route";
import { convertToXlsx } from "@/app/lib/main";
import { writeFile } from "xlsx-js-style";
import { Skeleton } from "@/components/ui/skeleton";

const handleResultDownload = (id: string) => {
  axios
    .get<ExamResultSingleApiType | null>(`/api/secure/sbte-result/single/${id}`)
    .then(({ data }) => {
      console.log(data);
      data &&
        writeFile(
          convertToXlsx(data.data, {
            isCgpa: true,
            isImark: true,
            sortType: "registerNo",
          }),
          `SBTE Exam result (${data.month}-${data.year}).xlsx`
        );
    });
};

export const columns: ColumnDef<ExamResultHistoryApiType[0]>[] = [
  {
    id: "id",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "createdAt",

    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Time
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: (value) => (
      <div className="capitalize">
        {dayjs(value.getValue() as string).format("DD-MM-YY hh:mm A")}
      </div>
    ),
  },
  {
    accessorKey: "month",
    header: "Exam month",

    cell: ({ row }) => (
      <div className="capitalise">
        {row.getValue("month")} {row.original.year}
      </div>
    ),
  },
  {
    accessorKey: "regularResultCount",
    header: "Data count",
    cell: ({ row }) => (
      <div className="">
        <span>
          Regular{" "}
          <Badge variant="secondary">{row.original.regularResultCount}</Badge>
        </span>
        <span className="ml-2">
          Supply{" "}
          <Badge variant="secondary">
            {row.original.supplementaryResultCount}
          </Badge>
        </span>
      </div>
    ),
  },
  {
    accessorKey: "semesters",
    header: "Semesters",
    cell: (cell) => (
      <div>
        {Object.keys(cell.row.original.semesters || {}).map((e) => {
          const v = cell.row.original.semesters;
          return (
            <>
              <span className="mx-1">
                Sem {e} <Badge variant="secondary">{v[e]}</Badge>
              </span>
            </>
          );
        })}
      </div>
    ),
  },
  {
    id: "id",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => handleResultDownload(row.original.id)}
            >
              Download sheet
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-500"
              onClick={() =>
                axios
                  .delete("/api/secure/sbte-result/history", {
                    data: {
                      id: row.original.id,
                    },
                  })
                  .then((e) => {
                    mutate("/api/secure/sbte-result/history");
                  })
              }
            >
              Delete
            </DropdownMenuItem>
            {/* <DropdownMenuSeparator /> */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function HistoryTable() {
  const { data: apiData, isLoading } = useGet<ExamResultHistoryApiType>(
    "/api/secure/sbte-result/history"
  );

  const data = React.useMemo(() => {
    return apiData || [];
  }, [apiData]);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});
  console.log(data);
  const table = useReactTable({
    data: data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <Skeleton className="w-full mb-3 last:mb-0 h-[20px]" />
                  <Skeleton className="w-full mb-3 last:mb-0 h-[20px]" />
                  <Skeleton className="w-full mb-3 last:mb-0 h-[20px]" />
                  <Skeleton className="w-full mb-3 last:mb-0 h-[20px]" />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
