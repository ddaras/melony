"use client";

import { avatar } from "melony";

export const avatarCell = ({ row }: { row: any }) => {
  return avatar({
    src: row.original.avatar,
  });
};
