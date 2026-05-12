import React from "react";

type JsonLdProps = {
  data: Record<string, unknown>;
};

function JsonLdScript({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

type ImageObject = {
  "@type": "ImageObject";
  url: string;
  width?: number;
  height?: number;
};

export function OrganizationJsonLd({
  name,
  url,
  logo,
}: {
  name: string;
  url: string;
  logo: ImageObject;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    logo,
  };
  return <JsonLdScript data={data} />;
}

export function WebSiteJsonLd({
  name,
  url,
  description,
  keywords,
}: {
  name: string;
  url: string;
  description?: string;
  keywords?: string[];
}) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
  if (description) data.description = description;
  if (keywords && keywords.length > 0) data.keywords = keywords.join(", ");
  return <JsonLdScript data={data} />;
}

export function CreativeWorkJsonLd({
  name,
  url,
  image,
  dateCreated,
  creator,
  keywords,
}: {
  name: string;
  url: string;
  image?: string;
  dateCreated?: string;
  creator?: { name: string; url?: string };
  keywords?: string[];
}) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name,
    url,
  };
  if (image) data.image = image;
  if (dateCreated) data.dateCreated = dateCreated;
  if (creator) {
    data.creator = {
      "@type": "Person",
      name: creator.name,
      ...(creator.url ? { url: creator.url } : {}),
    };
  }
  if (keywords && keywords.length > 0) data.keywords = keywords.join(", ");
  return <JsonLdScript data={data} />;
}

export function BreadcrumbListJsonLd({
  items,
}: {
  items: Array<{ name: string; url: string }>;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
  return <JsonLdScript data={data} />;
}

export function ProfileJsonLd({
  name,
  url,
}: {
  name: string;
  url: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name,
      url,
    },
  };
  return <JsonLdScript data={data} />;
}
