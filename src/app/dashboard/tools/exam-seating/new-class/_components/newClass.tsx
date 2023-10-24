"use client";
import React, { useState } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  ArrowUp,
  BoxSelect,
  Dice1,
  RectangleHorizontal,
  RockingChair,
  Save,
} from "lucide-react";
import { CalendarIcon, PlusCircledIcon, PlusIcon } from "@radix-ui/react-icons";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

function NewClassComponent() {
  return (
    <div>
      <ContextMenu>
        <ContextMenuTrigger>
          <ClassLayout />
        </ContextMenuTrigger>
        <ContextMenuContent className="w-64">
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <CalendarIcon className="mr-2 h-4 w-4" />
              New Desk
            </ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-48">
              <ContextMenuItem>2 Seats</ContextMenuItem>
              <ContextMenuItem>3 Seats</ContextMenuItem>
              <ContextMenuItem>4 Seats</ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem>Custom</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuItem>New Drawing Table</ContextMenuItem>
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <CalendarIcon className="mr-2 h-4 w-4" />
              New Free Space
            </ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-48">
              <ContextMenuItem>2 Seats</ContextMenuItem>
              <ContextMenuItem>3 Seats</ContextMenuItem>
              <ContextMenuItem>4 Seats</ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem>Custom</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuItem>Custom</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}

export default NewClassComponent;

function ClassLayout() {
  return (
    <div className="border flex flex-col gap-8 pb-8 md:gap-10 md:pb-10">
      <div className="w-full flex justify-center">
        <p className="border text-xs text-gray-400 tracking-widest px-4">
          <ArrowUp className="inline-block mx-1" size={12} />
          Front side
          <ArrowUp className="inline-block mx-1" size={12} />
        </p>
      </div>
      <div className="flex p-4 items-start space-x-2">
        <AddNewButton />
      </div>
    </div>
  );
}

enum SeatType {
  THEORY,
  DRAWING,
  COMMON,
  BLANK,
}

type SeatObjectType = {
  name: string;
  seatCount: number;
  structure: SeatType[];
};

const preDefinedSeats: { [key: string]: SeatObjectType } = {
  threeSeatDesk: {
    name: "3 Seat Desk",
    seatCount: 3,
    structure: [SeatType.THEORY, SeatType.THEORY, SeatType.THEORY],
  },
  twoSeatDesk: {
    name: "2 Seat Desk",
    seatCount: 2,
    structure: [SeatType.THEORY, SeatType.THEORY],
  },
  fourSeatDesk: {
    name: "4 Seat Desk",
    seatCount: 4,
    structure: [
      SeatType.THEORY,
      SeatType.THEORY,
      SeatType.THEORY,
      SeatType.THEORY,
    ],
  },
  drawingTable: {
    name: "drawingTable",
    seatCount: 1,
    structure: [SeatType.DRAWING],
  },
  oneBlackSpace: {
    name: "1 Blank Space",
    seatCount: 1,
    structure: [SeatType.BLANK],
  },
  twoBlankSpace: {
    name: "2 Blank Space",
    seatCount: 2,
    structure: [SeatType.BLANK, SeatType.BLANK],
  },
  threeBlankSpace: {
    name: "3 Blank Space",
    seatCount: 3,
    structure: [SeatType.BLANK, SeatType.BLANK, SeatType.BLANK],
  },
  fourBlankSpace: {
    name: "4 Blank Space",
    seatCount: 4,
    structure: [SeatType.BLANK, SeatType.BLANK, SeatType.BLANK, SeatType.BLANK],
  },
};

function AddNewButton({
  savedTypes,
  onAddNew,
}: {
  savedTypes?: SeatObjectType[];
  onAddNew?: (seatType: SeatObjectType) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const closeModal = () => setIsOpen(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <PlusIcon className="w-8 h-8" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <RectangleHorizontal className="mr-2 h-4 w-4" />
                New desk
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    onClick={() => {
                      onAddNew && onAddNew(preDefinedSeats.twoSeatDesk);
                    }}
                  >
                    2 Seats
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      onAddNew && onAddNew(preDefinedSeats.threeSeatDesk);
                    }}
                  >
                    3 Seats
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      onAddNew && onAddNew(preDefinedSeats.fourSeatDesk);
                    }}
                  >
                    4 Seats
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DialogTrigger asChild>
                    <DropdownMenuItem>More...</DropdownMenuItem>
                  </DialogTrigger>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <BoxSelect className="mr-2 h-4 w-4" />
                New blank space
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    onClick={() => {
                      onAddNew && onAddNew(preDefinedSeats.oneBlackSpace);
                    }}
                  >
                    1 Seat
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      onAddNew && onAddNew(preDefinedSeats.twoBlankSpace);
                    }}
                  >
                    2 Seats
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      onAddNew && onAddNew(preDefinedSeats.threeBlankSpace);
                    }}
                  >
                    3 Seats
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      onAddNew && onAddNew(preDefinedSeats.fourBlankSpace);
                    }}
                  >
                    4 Seats
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DialogTrigger asChild>
                    <DropdownMenuItem>More...</DropdownMenuItem>
                  </DialogTrigger>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuItem
              onClick={() => {
                onAddNew && onAddNew(preDefinedSeats.drawingTable);
              }}
            >
              <Dice1 className="mr-2 h-4 w-4" />
              New Drawing Table
            </DropdownMenuItem>
            <DialogTrigger asChild>
              <DropdownMenuItem>
                <RockingChair className="mr-2 h-4 w-4" />
                Custom seat
              </DropdownMenuItem>
            </DialogTrigger>
          </DropdownMenuGroup>
          {savedTypes && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Save className="mr-2 h-4 w-4" />
                    Saved seats
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    {savedTypes.map((e) => (
                      <React.Fragment key={e.name}>
                        <DropdownMenuItem
                          onClick={() => {
                            onAddNew && onAddNew(e);
                          }}
                        >
                          <RockingChair className="mr-2 h-4 w-4" />
                          {e.name}
                        </DropdownMenuItem>
                      </React.Fragment>
                    ))}
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuGroup>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <AddNewSeatDialog closeModal={closeModal} onAddNew={onAddNew} />
    </Dialog>
  );
}

function AddNewSeatDialog({
  onAddNew,
  closeModal,
}: {
  onAddNew?: (seatType: SeatObjectType) => void;
  closeModal: () => void;
}) {
  const [seats, setseats] = useState([] as SeatType[]);
  const [name, setName] = useState("");
  return (
    <DialogContent className="sm:min-w-[425px]">
      <DialogHeader>
        <DialogTitle>Add new desk/table</DialogTitle>
        <DialogDescription>
          Add seats and seat types here. You can save them for later use.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="name">Seat Name</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="name"
            id="name"
            placeholder="Seat Name"
          />
        </div>
        <Label htmlFor="name" className="">
          Seats
        </Label>
        <p className="text-sm text-slate-400">
          Click on each seat to change seat type. <strong>T</strong> means
          Theory only, <strong>D</strong> means Drawing only, <strong>C</strong>{" "}
          means Common seat and <strong>B</strong> means Blank space.
        </p>
        <div
          className={`flex space-x-2 ${
            seats.length > 1 ? "justify-between" : "justify-start"
          } border p-1`}
        >
          {seats.map((e, i) => {
            const _seats = [...seats];
            return (
              <TooltipProvider key={i}>
                <Tooltip>
                  <TooltipTrigger
                    onClick={() => {
                      _seats[i] = (_seats[i] + 1) % 4;
                      setseats(_seats);
                    }}
                    className="group hover:bg-zinc-800 flex w-11 pl-4 hover:pl-3 hover:w-auto text-sm duration-300 items-center pr-3 border rounded-md"
                  >
                    <div className="">
                      {seatTypeDescription[e].charAt(0).toUpperCase()}
                    </div>
                    <div className="invisible  group-hover:visible flex-shrink-0">
                      {seatTypeDescription[e].slice(1)}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{seatTypeDescription[e]}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
          <Button
            onClick={() => setseats([...seats, SeatType.THEORY])}
            variant="outline"
            className="py-5 flex items-center group px-3"
          >
            <PlusCircledIcon className="h-4 w-4 group-hover:mr-2" />
            <div className="group-hover:block hidden">Add new</div>
          </Button>
        </div>
      </div>
      <DialogFooter>
        <Button variant="secondary" onClick={() => setseats([])} type="reset">
          Reset
        </Button>

        <Button
          type="submit"
          onClick={() => {
            onAddNew &&
              onAddNew({
                name: name ?? "Custom",
                seatCount: seats.length,
                structure: seats,
              });
            closeModal();
          }}
        >
          Save changes
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

const seatTypeDescription = {
  [SeatType.THEORY]: "Theory only",
  [SeatType.DRAWING]: "Drawing only",
  [SeatType.COMMON]: "Common seat",
  [SeatType.BLANK]: "Blank space",
};

const seatTypeMin = {
  [SeatType.THEORY]: "T",
  [SeatType.DRAWING]: "D",
  [SeatType.COMMON]: "C",
  [SeatType.BLANK]: "B",
};
