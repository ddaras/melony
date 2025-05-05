"use client";

import { chip } from "melony";

export const statusCell = ({
  row,
}: {
  row: { original: { status: string } };
}) => {
  return chip({
    label: row.original.status,
  });
};
