import Link from "next/link";

type HeadingProps = {
    title: string;
    subtitle?: string;
    href?: string;
}

export default function Headings({ title, subtitle, href }: HeadingProps) {
    return (
      <div className="flex items-end justify-between mb-4">
        <div>
          <h4 className="text-sm text-neutral-400 font-medium mb-1">{subtitle}</h4>
          <h2 className="text-2xl sm:text-3xl text-neutral-100 font-bold ">
            {title}
          </h2>
        </div>
        {href && (
        <Link
            href={href}
            className="text-sm text-neutral-100 hover:text-primary-400 transition-colors flex items-center gap-1"
            >
            更多
            <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
                />
            </svg>
        </Link>
        )}
      </div>
    );
}