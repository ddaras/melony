"use client";

import { avatar } from "melony";

export const avatarCell = ({
  row,
}: {
  row: { original: { avatar: string } };
}) => {
  return avatar({
    src: row.original.avatar,
  });
};
