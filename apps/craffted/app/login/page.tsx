"use client";

import { AuthButton } from "@/components/auth-button";
import { vstack } from "melony";

export default function LoginPage() {
  return vstack({
    children: [AuthButton()],
  });
}
