"use client";

import { heading } from "melony";
import { vstack } from "melony";
import { loginForm } from "@/app/components/login-form";

export default function LoginPage() {
  return vstack()
    .className(
      "container mx-auto max-w-md space-y-4 h-full w-full flex-1 flex flex-col justify-center"
    )
    .children([heading().title("Login"), loginForm()]);
}
