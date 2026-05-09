import React from "react";
import { Card, CardContent, CardDescription,CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

type CardCompactProp = {
  title: string;
  description: string;
  className?: string;
  content: React.ReactNode;
  footer?: React.ReactNode;
};

export default function CardCompact({ title, description, className, content, footer }: CardCompactProp) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {content}
      </CardContent>
      <CardFooter>
        {footer}
      </CardFooter>
    </Card>
  );
}
