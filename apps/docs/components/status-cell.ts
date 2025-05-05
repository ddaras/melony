"use client";

import { chip } from "melony";

export const statusCell = ({ row }: { row: any }) => {
  return chip(row.original.status);
};
