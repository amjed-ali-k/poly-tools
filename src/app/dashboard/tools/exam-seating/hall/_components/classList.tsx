"use client";

import * as React from "react";
import dayjs from "dayjs";

import { CaretSortIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { mutate } from "swr";
import { Skeleton } from "@/components/ui/skeleton";
import { ExamHall } from "@prisma/client";
import Link from "next/link";

export const columns: ColumnDef<ExamHall>[] = [
  {
    accessorKey: "name",
    header: "Hall Name",
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
    accessorKey: "commonSeats",
    header: "Seats",
    cell: ({ row }) => (
      <div className="">
        <span>
          Common <Badge variant="secondary">{row.original.commonSeats}</Badge>
        </span>
        <span className="ml-2">
          Theory{" "}
          <Badge variant="secondary">{row.original.theoryOnlySeats}</Badge>
        </span>
        <span className="ml-2">
          Drawing{" "}
          <Badge variant="secondary">{row.original.drawingOnlySeats}</Badge>
        </span>
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
            <Link
              href={`/dashboard/tools/exam-seating/hall/${row.original.id}`}
            >
              <DropdownMenuItem>Edit</DropdownMenuItem>
            </Link>
            <DropdownMenuItem
              className="text-red-500"
              onClick={() =>
                axios
                  .delete("/api/secure/exam-seating/", {
                    data: {
                      id: row.original.id,
                    },
                  })
                  .then(() => {
                    mutate("/api/secure/exam-seating/all");
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

export function ClassListTable() {
  const { data: apiData, isLoading } = useGet<ExamHall[]>(
    "/api/secure/exam-seating/all"
  );

  const data = React.useMemo(() => {
    return apiData ?? [];
  }, [apiData]) as ExamHall[];

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const table = useReactTable({
    data,
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
