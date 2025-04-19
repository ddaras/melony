import {
  form,
  formTextInput,
  formPasswordInput,
  submitButton,
  vstack,
  text,
  mutation,
  toast,
} from "melony";
import { loginAction } from "@/lib/actions/auth";

export const loginForm = () => {
  return mutation()
    .action(loginAction)
    .onSuccess(({ navigate }) => {
      toast().message("Login successful").success();
      navigate("/");
    })
    .onError(({ navigate }) => {
      toast().message("Login failed").error();
      navigate("/login");
    })
    .render((mutation) => {
      return vstack()
        .className("space-y-4")
        .children([
          form()
            .onSubmit(mutation.mutate)
            .children([
              formTextInput().label("Username").name("username"),
              formPasswordInput().label("Password").name("password"),
              submitButton().label("Login").isSubmitting(mutation.isPending),
            ]),
          text().content("Forgot your password?"),
        ]);
    });
};
