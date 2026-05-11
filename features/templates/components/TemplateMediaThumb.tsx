import type { templates } from "@/app/generated/prisma/client";
import Image from "next/image";
import { cn } from "@/lib/utils";

type TemplateMediaFields = Pick<
  templates,
  "media_type" | "media_url" | "name"
>;

type CommonProps = {
  template: TemplateMediaFields;
  className?: string;
  alt?: string;
  priority?: boolean;
};

type FillProps = CommonProps & {
  fill: true;
  sizes: string;
  width?: never;
  height?: never;
};

type SizedProps = CommonProps & {
  fill?: false;
  width: number;
  height: number;
  sizes?: string;
};

type Props = FillProps | SizedProps;

export default function TemplateMediaThumb(props: Props) {
  const { template, className, alt, priority } = props;
  const useVideo =
    template.media_type === "gif" && Boolean(template.media_url);

  if (useVideo) {
    const videoCommon = {
      src: template.media_url ?? undefined,
      autoPlay: true,
      muted: true,
      loop: true,
      playsInline: true,
      disablePictureInPicture: true,
      controlsList: "nodownload noremoteplayback",
      draggable: false,
      "aria-label": alt ?? template.name,
    } as const;

    if (props.fill) {
      return (
        <video
          {...videoCommon}
          className={cn(
            "pointer-events-none absolute inset-0 h-full w-full",
            className,
          )}
        />
      );
    }

    return (
      <video
        {...videoCommon}
        width={props.width}
        height={props.height}
        className={cn("pointer-events-none", className)}
      />
    );
  }

  if (props.fill) {
    return (
      <Image
        src={template.media_url ?? ""}
        alt={alt ?? template.name}
        fill
        sizes={props.sizes}
        priority={priority}
        className={className}
      />
    );
  }

  return (
    <Image
      src={template.media_url ?? ""}
      alt={alt ?? template.name}
      width={props.width}
      height={props.height}
      sizes={props.sizes}
      priority={priority}
      className={className}
    />
  );
}
