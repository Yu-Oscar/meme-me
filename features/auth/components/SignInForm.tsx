"use client";
import Form from "@/components/form/Form";
import { SubmitButton } from "@/components/form/SubmitButton";
import { Input } from "@/components/ui/input";
import { signInAction } from "../actions/sign-in";
import { useActionState } from "react";
import { type ActionState, EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import FieldError from "@/components/form/FieldError";

export default function SignInForm() {

    const [actionState, action] = useActionState<ActionState, FormData>(signInAction, EMPTY_ACTION_STATE);

    return (
      <Form action={action} actionState={actionState} >
        <Input type="email" name="email" placeholder="Email" defaultValue={actionState.payload?.get("email") as string}/>
        <FieldError actionState={actionState} name="email" />


        <Input type="password" name="password" placeholder="Password" defaultValue={actionState.payload?.get("password") as string}/>
        <FieldError actionState={actionState} name="password" />

        <SubmitButton label="Sign Up" variant="default" />
      </Form>
    );
}