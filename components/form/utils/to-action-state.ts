import { flattenError, ZodError } from "zod";

export type ActionState = {
  status?: "SUCCESS" | "ERROR";
  message: string;
  payload?: FormData;
  fieldErrors: Record<string, string[] | undefined>;
  timestamp: number;
};

export const EMPTY_ACTION_STATE: ActionState = {
  status: "SUCCESS",
  message: "",
  fieldErrors: {},
  payload: undefined,
  timestamp: 0,
};

export function fromErrorToActionState(
  error: unknown,
  formData?: FormData,
): ActionState {
  if (error instanceof ZodError) {
    return {
      status: "ERROR",
      message: "",
      fieldErrors: flattenError(error).fieldErrors,
      payload: formData,
      timestamp: Date.now(),
    };
  } else if (error instanceof Error) {
    return {
      status: "ERROR",
      message: error.message || "Something went wrong",
      fieldErrors: {},
      payload: formData,
      timestamp: Date.now(),
    };
  } else {
    return {
      status: "ERROR",
      message: "unknown error occurred",
      fieldErrors: {},
      payload: formData,
      timestamp: Date.now(),
    };
  }
}

export function toActionState(status: ActionState["status"], message: string, formData?: FormData, data?: unknown): ActionState {
  return {
    status,
    message,
    fieldErrors: {},
    timestamp: Date.now(),
    payload: formData,
  };
}