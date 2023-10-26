import {
  Page,
  Text,
  View,
  Font,
  Document,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";
import { ArrangedResult } from "./NewExamForm";
import React, { useEffect, useMemo, useState } from "react";
import { boil, max } from "radash";
import { SeatType } from "../../../new-class/_components/newClass";
import { AllocatedSeat } from "@/lib/examTools/hallSort";

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
    width: 600,
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

export function ExamHallPDF({ seats }: { seats: ArrangedResult[] }) {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleResize() {
      ref.current?.offsetWidth && setWidth(ref.current.offsetWidth);
      ref.current?.offsetHeight && setHeight(ref.current.offsetHeight);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const maxSeat = useMemo(() => {
    return (
      (max(
        seats.map((hall) => max(hall.seats.map((row) => row.seat))),
        (e) => e || 0
      ) || 0) + 1
    );
  }, [seats]);

  return (
    <PDFViewer className="w-full h-[700px]">
      <Document>
        {seats.map((hall) => (
          <Page
            ref={ref as any}
            key={hall.hall}
            size="A4"
            style={commonStyle.page}
          >
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
                                width: 550 / maxSeat,
                              }}
                              key={di}
                            >
                              <Text style={commonStyle.seatText}>
                                {getSeatData(ri, col, hall.seats)}
                              </Text>
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
          </Page>
        ))}
      </Document>
    </PDFViewer>
  );
}

function getSeatData(row: number, col: number, allocated: AllocatedSeat[]) {
  const seat = allocated.find((e) => e.row === row && e.seat === col);
  return seat?.regNo || " ";
}
