"use client";
import Form from "@/components/form/Form";
import { SubmitButton } from "@/components/form/SubmitButton";
import { Input } from "@/components/ui/input";
import { signUpAction } from "../actions/sign-up";
import { useActionState } from "react";
import { type ActionState, EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import FieldError from "@/components/form/FieldError";

export default function SignUpForm() {

    const [actionState, action] = useActionState<ActionState, FormData>(signUpAction, EMPTY_ACTION_STATE);

    return (
      <Form action={action} actionState={actionState} >
        <Input type="email" name="email" placeholder="Email" defaultValue={actionState.payload?.get("email") as string}/>
        <FieldError actionState={actionState} name="email" />

        <Input type="text" name="username" placeholder="Username" defaultValue={actionState.payload?.get("username") as string}/>
        <FieldError actionState={actionState} name="username" />

        <Input type="password" name="password" placeholder="Password" defaultValue={actionState.payload?.get("password") as string}/>
        <FieldError actionState={actionState} name="password" />

        <Input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          defaultValue={actionState.payload?.get("confirmPassword") as string}
        />
        <FieldError actionState={actionState} name="confirmPassword" />

        <SubmitButton label="Sign Up" variant="default" />
      </Form>
    );
}