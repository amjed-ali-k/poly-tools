"use client";
import React, { useRef, useState } from "react";
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
  Copy,
  Dice1,
  RectangleHorizontal,
  RockingChair,
  Save,
  Trash,
} from "lucide-react";
import { CalendarIcon, PlusCircledIcon, PlusIcon } from "@radix-ui/react-icons";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import cn from "classnames";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { ExamHall } from "@prisma/client";
import { useRouter } from "next/navigation";

function NewClassComponent() {
  const [hallName, setHallName] = useState("");
  const [structure, setStructure] = useState([[]] as SeatObjectType[][]);
  const { toast } = useToast();

  const router = useRouter();

  const onSubmit: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    if (hallName === "")
      return toast({
        title: "Hall name is required",
        description: "Please enter a name for the hall",
        variant: "destructive",
      });
    console.log(structure);
    axios
      .post<ExamHall>("/api/secure/exam-seating", { name: hallName, structure })
      .then((res) => {
        toast({
          title: "Well done!",
          description: `Class ${res.data.name} added successfully`,
        });
        router.push("/dashboard/tools/exam-seating/");
      });
  };
  return (
    <div className="flex-col space-y-3">
      <div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="name">Class/Hall Name (Required)</Label>
          <Input
            aria-invalid={hallName === ""}
            value={hallName}
            onChange={(e) => setHallName(e.target.value)}
            type="text"
            id="name"
            placeholder="Name"
          />
        </div>
      </div>
      <div>
        <h3 className="mb-3">Class structure</h3>
        <ClassLayout structure={structure} setStructure={setStructure} />
      </div>
      <div>
        <Button onClick={onSubmit}>Save and submit</Button>
      </div>
    </div>
  );
}

export default NewClassComponent;

function ClassLayout({
  structure,
  setStructure,
}: {
  structure: SeatObjectType[][];
  setStructure: (structure: SeatObjectType[][]) => void;
}) {
  const [savedDesks, setsavedDesks] = useState([] as SeatObjectType[]);

  const onAddNew = (seatType: SeatObjectType, row: number, col: number) => {
    const _structure = [...structure];
    const _row = _structure[row] ?? [];
    _row[col] = seatType;
    _structure[row] = _row;
    setStructure(_structure);

    if (preDefinedSeats[seatType.name]) return;
    setsavedDesks([...savedDesks, seatType]);
  };

  const onRemove = (row: number, col: number) => {
    const _structure = [...structure];
    const _row = _structure[row] ?? [];
    _row.splice(col, 1);
    _structure[row] = _row;
    setStructure(_structure);
  };
  return (
    <div className="border flex flex-col md:pb-10">
      <div className="w-full flex justify-center">
        <p className="border text-xs text-gray-400 tracking-widest px-4">
          <ArrowUp className="inline-block mx-1" size={12} />
          Front side
          <ArrowUp className="inline-block mx-1" size={12} />
        </p>
      </div>
      <div className="overflow-auto">
        {structure.map((e, i) => (
          <MyContextMenu
            key={i}
            savedTypes={savedDesks}
            onAddNew={(k) => onAddNew(k, i, e.length)}
          >
            <div className="flex p-4 items-center space-x-2 group/x-axis">
              {e.map((k, j) => (
                <SeatComponent
                  onAddNew={() => onAddNew(k, i, e.length)}
                  key={j}
                  seat={k}
                  onRemove={() => onRemove(i, j)}
                />
              ))}

              <div
                className={cn(
                  "h-20 w-20 duration-300 group-hover/x-axis:opacity-100 border border-dashed rounded-lg",
                  {
                    "opacity-0": e.length > 0,
                  }
                )}
              >
                <AddNewButton
                  savedTypes={savedDesks}
                  onAddNew={(st) => {
                    onAddNew(st, i, e.length);
                  }}
                />
              </div>
            </div>
          </MyContextMenu>
        ))}
      </div>
      <hr />
      <div className="p-4 w-full flex items-center">
        <div>
          <AddNewButton
            savedTypes={savedDesks}
            onAddNew={(st) => onAddNew(st, structure.length, 0)}
          />
        </div>
        <div className="mx-2">Add seat in new row</div>
      </div>
    </div>
  );
}

function MyContextMenu({
  children,
  savedTypes,
  onAddNew,
}: {
  savedTypes?: SeatObjectType[];
  onAddNew?: (seatType: SeatObjectType) => void;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const closeModal = () => setIsOpen(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <ContextMenu>
        <ContextMenuTrigger>{children}</ContextMenuTrigger>
        <ContextMenuContent className="w-64">
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <CalendarIcon className="mr-2 h-4 w-4" />
              New Desk
            </ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-48">
              <ContextMenuItem
                onClick={() => {
                  onAddNew && onAddNew(preDefinedSeats.twoSeatDesk);
                }}
              >
                2 Seats
              </ContextMenuItem>
              <ContextMenuItem
                onClick={() => {
                  onAddNew && onAddNew(preDefinedSeats.threeSeatDesk);
                }}
              >
                3 Seats
              </ContextMenuItem>
              <ContextMenuItem
                onClick={() => {
                  onAddNew && onAddNew(preDefinedSeats.fourSeatDesk);
                }}
              >
                4 Seats
              </ContextMenuItem>
              <ContextMenuSeparator />
              <DialogTrigger asChild>
                <ContextMenuItem>Custom</ContextMenuItem>
              </DialogTrigger>
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuItem>New Drawing Table</ContextMenuItem>
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <CalendarIcon className="mr-2 h-4 w-4" />
              New Free Space
            </ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-48">
              <ContextMenuItem
                onClick={() => {
                  onAddNew && onAddNew(preDefinedSeats.oneBlackSpace);
                }}
              >
                1 Seats
              </ContextMenuItem>
              <ContextMenuItem
                onClick={() => {
                  onAddNew && onAddNew(preDefinedSeats.twoBlankSpace);
                }}
              >
                2 Seats
              </ContextMenuItem>
              <ContextMenuItem
                onClick={() => {
                  onAddNew && onAddNew(preDefinedSeats.threeBlankSpace);
                }}
              >
                3 Seats
              </ContextMenuItem>
              <ContextMenuItem
                onClick={() => {
                  onAddNew && onAddNew(preDefinedSeats.fourBlankSpace);
                }}
              >
                4 Seats
              </ContextMenuItem>
              <ContextMenuSeparator />
              <DialogTrigger asChild>
                <ContextMenuItem>Custom</ContextMenuItem>
              </DialogTrigger>
            </ContextMenuSubContent>
          </ContextMenuSub>
          <DialogTrigger asChild>
            <ContextMenuItem>Custom</ContextMenuItem>
          </DialogTrigger>
          {savedTypes && savedTypes.length > 1 && (
            <>
              <ContextMenuSeparator />

              <ContextMenuSub>
                <ContextMenuSubTrigger>
                  <Save className="mr-2 h-4 w-4" />
                  Saved seats
                </ContextMenuSubTrigger>
                <ContextMenuSubContent>
                  {savedTypes.map((e) => (
                    <React.Fragment key={e.name}>
                      <ContextMenuItem
                        onClick={() => {
                          onAddNew && onAddNew(e);
                        }}
                      >
                        <RockingChair className="mr-2 h-4 w-4" />
                        {e.name}
                      </ContextMenuItem>
                    </React.Fragment>
                  ))}
                </ContextMenuSubContent>
              </ContextMenuSub>
            </>
          )}
        </ContextMenuContent>
      </ContextMenu>
      <AddNewSeatDialog closeModal={closeModal} onAddNew={onAddNew} />
    </Dialog>
  );
}

function SeatComponent({
  seat,
  onRemove,
  onAddNew,
}: {
  seat: SeatObjectType;
  onAddNew?: () => void;
  onRemove: () => void;
}) {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          className={cn(
            "flex shrink-0 relative group border m-4 rounded-lg overflow-hidden",
            {
              "border-dashed border-2":
                seat.structure.reduce((a, b) => b !== SeatType.BLANK, false) ===
                false,
            }
          )}
        >
          <div className="absolute opacity-0 delay-1000 translate-x-20 group-hover:opacity-100 group-hover:translate-x-0 duration-500 right-1 top-5">
            <Button variant="destructive" onClick={onRemove}>
              <Trash className="h-4 w-4" />
            </Button>
          </div>
          {seat.structure.map((e, i) => {
            return (
              <TooltipProvider key={i}>
                <Tooltip>
                  <TooltipTrigger
                    className={cn(
                      `flex w-20 h-20 shrink-0 items-center justify-center`,
                      {
                        "": e === SeatType.BLANK,
                        "bg-teal-950/20": e === SeatType.COMMON,
                        "bg-indigo-950/20": e === SeatType.DRAWING,
                        "bg-green-950/20": e === SeatType.THEORY,
                        "border-x first:border-l-0 last:border-r-0":
                          e !== SeatType.BLANK,
                      }
                    )}
                  >
                    {SeatType.BLANK !== e && seatTypeMin[e]}
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{seatTypeDescription[e]}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem className="" onClick={onAddNew}>
          <Copy className="mr-2 h-4 w-4" />
          Duplicate
        </ContextMenuItem>
        <ContextMenuItem onClick={onRemove} className="text-red-500">
          <Trash className="mr-2 h-4 w-4" />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

export enum SeatType {
  THEORY,
  DRAWING,
  COMMON,
  BLANK,
}

export type SeatObjectType = {
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
          <Button className="h-full w-full border-0" variant="outline">
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
          {/* {savedTypes && savedTypes.length > 1 && (
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
                      <DropdownMenuItem
                        key={e.name + e.seatCount}
                        onClick={() => {
                          onAddNew && onAddNew(e);
                        }}
                      >
                        <RockingChair className="mr-2 h-4 w-4" />
                        {e.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuGroup>
            </>
          )} */}
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
