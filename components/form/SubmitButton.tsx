'use client';
import { LucideLoaderCircle } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";

type SubmitButtonProps = {
  label: string;
  icon?: React.ReactNode;
  variant?: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link";
};

export const SubmitButton = ({ label, icon, variant = "default" }: SubmitButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant={variant}>
      {pending && <LucideLoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
      {icon ? icon : label}
    </Button>
  );
};
