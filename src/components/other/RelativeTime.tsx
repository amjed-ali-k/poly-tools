"use client";
import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

function RelativeTime({ date }: { date: Date }) {
  return <>{dayjs(date).toNow()}</>;
}

export default RelativeTime;
