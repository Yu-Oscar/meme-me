import { useEffect, useRef } from "react";
import { ActionState } from "../utils/to-action-state";

type useFeedbackOptions = {
  onSuccess?: ({ actionState }: { actionState: ActionState }) => void;
  onError?: ({ actionState }: { actionState: ActionState }) => void;
};

type useActionFeedbackProps = {
  actionState: ActionState;
  options: useFeedbackOptions;
};

export default function useActionFeedback({ actionState, options }: useActionFeedbackProps) {
  const prevTimestamp = useRef(actionState.timestamp);

  useEffect(() => {
    const isUpdate = prevTimestamp.current !== actionState.timestamp;
    if (!isUpdate) return;

    prevTimestamp.current = actionState.timestamp;

    if (actionState.status === "SUCCESS") {
      options.onSuccess?.({ actionState });
    } else if (actionState.status === "ERROR") {
      options.onError?.({ actionState });
    }
  }, [actionState, options]);
}