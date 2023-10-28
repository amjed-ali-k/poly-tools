import {
  Page,
  Text,
  View,
  Font,
  Document,
  StyleSheet,
  usePDF,
} from "@react-pdf/renderer";
import { ArrangedResult } from "./NewExamForm";
import React, { useEffect, useMemo, useReducer, useState } from "react";
import { group, mapValues, max } from "radash";
import { SeatType } from "../../../new-class/_components/newClass";
import { AllocatedSeat } from "@/lib/examTools/hallSort";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const commonStyle = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
    justifyContent: "flex-start",
    fontFamily: "Inter",
    paddingVertical: 10,
  },
  section: {
    margin: 2,
    padding: 2,
  },

  desk: {
    display: "flex",
    flexDirection: "row",
    margin: 2,
    borderWidth: 2,
    borderColor: "#000",
    justifyContent: "space-between",
  },
  headingContainer: {
    fontWeight: "bold",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 4,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  titleContainer: {
    fontWeight: "extrabold",
    textAlign: "center",
  },
  subTitleContainer: {
    textAlign: "center",
    fontSize: 12,
    padding: 5,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    margin: 2,
  },

  deskViewContainer: {
    margin: 3,
    paddingTop: 20,
  },
  seat: {
    textAlign: "center",
  },
  seatText: {
    fontSize: 12,
    marginVertical: 2,
    fontWeight: "semibold",
    paddingVertical: 5,
  },
  frontSide: {
    fontSize: 8,
    letterSpacing: 2,
  },
  frontSideTextContainer: {
    width: "100%",
    borderTopWidth: 1,
    paddingTop: 3,
    textAlign: "center",
  },
  signContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    fontSize: 10,
    paddingHorizontal: 30,
    marginTop: 20,
    borderTopWidth: 1,
    paddingTop: 50,
  },
});

Font.register({
  family: "Inter",
  fonts: [
    {
      src: "http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyeMZhrib2Bg-4.ttf",
      fontWeight: 100,
    },
    {
      src: "http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuDyfMZhrib2Bg-4.ttf",
      fontWeight: 200,
    },
    {
      src: "http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuOKfMZhrib2Bg-4.ttf",
      fontWeight: 300,
    },
    {
      src: "http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf",
      fontWeight: 400,
    },
    {
      src: "http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fMZhrib2Bg-4.ttf",
      fontWeight: 500,
    },
    {
      src: "http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYMZhrib2Bg-4.ttf",
      fontWeight: 600,
    },
    {
      src: "http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYMZhrib2Bg-4.ttf",
      fontWeight: 700,
    },
    {
      src: "http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuDyYMZhrib2Bg-4.ttf",
      fontWeight: 800,
    },
    {
      src: "http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuBWYMZhrib2Bg-4.ttf",
      fontWeight: 900,
    },
  ],
});

const seatingSchema = z.object({
  alignment: z.string(),
  title: z.string().min(0).optional(),
  nameSelect: z.string(),
});

export function GenerateSeatArrangements({
  seats,
}: {
  seats: ArrangedResult[];
}) {
  const [instance, updateInstance] = usePDF({
    document: <ExamHallPDF seats={seats} />,
  });

  const form = useForm<z.infer<typeof seatingSchema>>({
    resolver: zodResolver(seatingSchema),
    defaultValues: {
      alignment: "portrait",
      nameSelect: "regNo",
      title: "",
    },
  });

  function onSubmit(data: z.infer<typeof seatingSchema>) {
    updateInstance(<ExamHallPDF seats={seats} options={data} />);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="w-full">
          <CardContent className="p-4">
            <div>
              <h5 className="text-lg font-bold">Seating arrangement</h5>
              <p className="text-sm text-gray-400 mb-2">
                Seating arrangement sheets are made to paste in front of exam
                halls. So that students can sit on respective positions
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <FormField
                control={form.control}
                name="alignment"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Page alignment</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem defaultChecked value="portrait" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Portrait
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="landscape" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Landscape
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Series Exam - 2024 Jan" {...field} />
                    </FormControl>
                    <FormDescription>
                      This will be the title of all pages.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nameSelect"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student Name</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue="regNo">
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a field to display in student name" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="regNo">Normal</SelectItem>
                        <SelectItem value="regNumber">Reg Number</SelectItem>
                        <SelectItem value="admnNumber">Admn Number</SelectItem>
                        <SelectItem value="rollNumber">Roll Number</SelectItem>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="primaryNumber">Primary</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose which value should be printed in student name
                      session
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className=" w-64" variant="default">
                Update
              </Button>
            </div>
            <div className="w-full">
              {seats && instance.url && (
                <iframe height="700px" width="100%" src={instance.url}></iframe>
              )}
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}

function ExamHallPDF({
  seats,
  options,
}: {
  seats: ArrangedResult[];
  options?: z.infer<typeof seatingSchema>;
}) {
  const maxSeat = useMemo(() => {
    return (
      (max(
        seats.map((hall) => max(hall.seats.map((row) => row.seat))),
        (e) => e || 0
      ) || 0) + 1
    );
  }, [seats]);
  const maxWidth = options?.alignment === "landscape" ? 842 : 595;

  return (
    <Document>
      {seats.map((hall) => (
        <Page
          key={hall.hall}
          size="A4"
          orientation={(options?.alignment as any) || "portrait"}
          style={commonStyle.page}
        >
          <View>
            {options?.title && options.title !== "" && (
              <View style={commonStyle.headingContainer}>
                <Text>{options?.title}</Text>
              </View>
            )}
            <View style={commonStyle.titleContainer}>
              <Text>{hall.hallName}</Text>
            </View>
            <View style={commonStyle.subTitleContainer}>
              <Text>Seating arrangement</Text>
            </View>
            <View style={commonStyle.frontSideTextContainer}>
              <Text style={commonStyle.frontSide}>FRONT SIDE</Text>
            </View>
            <View style={commonStyle.deskViewContainer}>
              {hall.hallStructure.map((row, ri) => (
                <View style={commonStyle.row} key={ri}>
                  {row.map((desks, i) => {
                    const isBlank = desks.structure.every(
                      (x) => x === SeatType.BLANK
                    );
                    return (
                      <View
                        style={{
                          ...commonStyle.desk,
                          borderColor: isBlank ? "#eee" : "#000",
                          color: isBlank ? "#fff" : "#000",
                        }}
                        key={i}
                      >
                        {desks.structure.map((seat, di) => {
                          const col =
                            row
                              .slice(0, i)
                              .reduce((a, b) => a + b.seatCount, 0) + di;

                          return (
                            <View
                              style={{
                                ...commonStyle.seat,
                                width: maxWidth / maxSeat,
                              }}
                              key={di}
                            >
                              <Text
                                style={commonStyle.seatText}
                                render={() => {
                                  return getSeatData(
                                    ri,
                                    col,
                                    hall.seats,
                                    options?.nameSelect
                                  );
                                }}
                              />
                            </View>
                          );
                        })}
                      </View>
                    );
                  })}
                </View>
              ))}
            </View>
            <View style={commonStyle.signContainer}>
              <Text>Sign and designation of Invigilator</Text>
            </View>
          </View>
        </Page>
      ))}
    </Document>
  );
}

function getSeatData(
  row: number,
  col: number,
  allocated: AllocatedSeat[],
  type?: string
) {
  const seat = allocated.find((e) => e.row === row && e.seat === col);
  if (type && seat && seat[type as keyof typeof seat]) {
    return seat[type as keyof typeof seat];
  }
  return seat?.regNo || " ";
}

const hallschema = z.object({
  alignment: z.string(),
  title: z.string().min(0).optional(),
  nameSelect: z.string(),
});

export function GenerateHallsAssignment({
  seats,
}: {
  seats: ArrangedResult[];
}) {
  const [instance, updateInstance] = usePDF({
    document: <ExamHallPDF seats={seats} />,
  });

  const form = useForm<z.infer<typeof hallschema>>({
    resolver: zodResolver(hallschema),
    defaultValues: {
      alignment: "portrait",
      nameSelect: "regNo",
      title: "",
    },
  });

  function onSubmit(data: z.infer<typeof hallschema>) {
    const hl = seats.map((hall) => {
      return {
        id: hall.hall,
        name: hall.hallName,
        subs: group(hall.seats, (e) => e.subjectCode),
        count: hall.seats.length,
      };
    });
    updateInstance(<HallArrangementPDF seats={hl} options={data} />);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="w-full">
          <CardContent className="p-4">
            <div>
              <h5 className="text-lg font-bold">Hall arrangement</h5>
              <p className="text-sm text-gray-400 mb-2">
                Hall arrangement sheets are made to paste in notice board. So
                that students can find respective halls
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <FormField
                control={form.control}
                name="alignment"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Page alignment</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem defaultChecked value="portrait" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Portrait
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="landscape" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Landscape
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Series Exam - 2024 Jan" {...field} />
                    </FormControl>
                    <FormDescription>
                      This will be the title of all pages.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nameSelect"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student Name</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue="regNo">
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a field to display in student name" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="regNo">Normal</SelectItem>
                        <SelectItem value="regNumber">Reg Number</SelectItem>
                        <SelectItem value="admnNumber">Admn Number</SelectItem>
                        <SelectItem value="rollNumber">Roll Number</SelectItem>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="primaryNumber">Primary</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose which value should be printed in student name
                      session
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className=" w-64" variant="default">
                Update
              </Button>
            </div>
            <div className="w-full">
              {seats && instance.url && (
                <iframe height="700px" width="100%" src={instance.url}></iframe>
              )}
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}

const hallStyle = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
    justifyContent: "flex-start",
    fontFamily: "Inter",
    padding: 10,
    width: "100%",
  },
  tableContainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    marginVertical: 10,
    border: 1,
    fontFamily: "Inter",
  },
  hallCol: {
    display: "flex",
    flexDirection: "column",
    width: "30%",
    padding: 10,
    borderRightWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  hallTitle: {
    fontSize: 12,
    fontWeight: "bold",
  },
  hallSubTitle: {
    fontSize: 10,
    fontWeight: "normal",
  },
  contentCol: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  contentTitleContainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    backgroundColor: "#eee",
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  contentTitle: {
    fontSize: 12,
    fontWeight: "bold",
    flex: 1,
  },
  contentDetails: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexWrap: "wrap",
  },
  contentItem: {
    fontSize: 12,
    lineHeight: 1.5,
    fontWeight: "normal",
    flex: 1,
  },
});

function HallArrangementPDF({
  seats,
  options,
}: {
  seats: {
    id: string;
    name: string;
    subs: Partial<Record<number, AllocatedSeat[]>>;
    count: number;
  }[];
  options?: z.infer<typeof seatingSchema>;
}) {
  return (
    <Document>
      <Page
        size="A4"
        orientation={(options?.alignment as any) || "portrait"}
        style={hallStyle.page}
      >
        <View>
          {options?.title && options.title !== "" && (
            <View style={commonStyle.titleContainer}>
              <Text>{options?.title}</Text>
            </View>
          )}
          <View style={commonStyle.subTitleContainer}>
            <Text>Hall arrangement</Text>
          </View>
          {seats.map((hall) => (
            <View key={hall.id}>
              <View style={hallStyle.tableContainer}>
                <View style={hallStyle.hallCol}>
                  {/* Hall Details */}
                  <Text style={hallStyle.hallTitle}>{hall.name}</Text>
                  <Text style={hallStyle.hallSubTitle}>
                    {hall.count} students
                  </Text>
                </View>
                <View style={hallStyle.contentCol}>
                  {Object.entries(hall.subs).map(([subCode, details]) => (
                    <View key={subCode} style={{ width: "100%" }}>
                      <View style={hallStyle.contentTitleContainer}>
                        {/* Subject Name  */}
                        <Text style={hallStyle.contentTitle}>{subCode}</Text>
                      </View>
                      <Text style={hallStyle.contentDetails}>
                        {/* Details */}
                        {details?.map((seat) => (
                          <Text
                            key={seat.name}
                            style={hallStyle.contentItem}
                            wrap
                          >
                            {seat[options?.nameSelect as keyof typeof seat] ||
                              seat.name ||
                              " "}
                            ,{" "}
                          </Text>
                        ))}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
