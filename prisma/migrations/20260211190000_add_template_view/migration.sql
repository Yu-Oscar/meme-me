-- CreateTable
CREATE TABLE "public"."template_view" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "template_id" UUID NOT NULL,
    "viewed_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "template_view_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "template_view_template_id_viewed_at_idx" ON "public"."template_view"("template_id", "viewed_at");

-- AddForeignKey
ALTER TABLE "public"."template_view" ADD CONSTRAINT "template_view_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "public"."templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
