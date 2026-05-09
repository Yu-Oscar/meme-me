import { toast } from "sonner";
import useActionFeedback from "./hooks/use-action-feedback";
import { ActionState } from "./utils/to-action-state";

type FormProps = {
  action: (payload: FormData) => void;
  actionState: ActionState;
  children: React.ReactNode;
  onSuccess?: (actionState: ActionState) => void;
};

export default function Form({
  action,
  actionState,
  children,
  onSuccess,
}: FormProps) {
  useActionFeedback({
    actionState,
    options: {
      onSuccess: ({ actionState }) => {
        if (actionState.message) {
          toast.success(actionState.message);
        }
        onSuccess?.(actionState);
      },
      onError: ({ actionState }) => {
        if (actionState.message) {
          toast.error(actionState.message);
        }
      },
    },
  });

  return (
    <form action={action} className="flex flex-col gap-y-2">
      {children}
    </form>
  );
}
