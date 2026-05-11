import { notFound, redirect } from "next/navigation";
import { getTemplate } from "@/features/templates/queries/get-template";
import Link from "next/link";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { HomePath } from "@/utils/path";
import TemplateMediaThumb from "@/features/templates/components/TemplateMediaThumb";

export default async function TemplatePage({ params }: { params: Promise<{ id: string }> }) {
    const user = await getAuthOrRedirect();
    
    const { id } = await params;
    const { template } = await getTemplate(id);
    if (!template) {
        return notFound();
    }
    if (user.id !== template.userId) {
      redirect(HomePath());
    }
    return (
      <div className="flex flex-1 flex-row gap-4 py-4">
        <div className="flex flex-col gap-4 w-[70%] px-24">
          <TemplateMediaThumb
            template={template}
            width={1000}
            height={1000}
            className="rounded-lg"
          />
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold">{template.name}</h1>
            <p className="text-sm text-gray-500">from {template.user.username}</p>
            <div className="flex flex-row gap-2 ">
            {template.tags.map((tag) => (
              <Link href={`/search?search=${tag}`} key={tag}>
                <p className="text-sm sm:text-base text-zinc-100 font-semibold truncate group-hover:text-primary-400 transition-colors">
                  <span className="text-primary">#</span>
                  {tag}
                </p>
              </Link>
            ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 w-[30%] mx-auto">other</div>
      </div>
    );
}