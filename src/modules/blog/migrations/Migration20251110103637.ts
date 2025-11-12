import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20251110103637 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "post" ("id" text not null, "title" text not null, "description" text not null, "content" text not null, "thumbnail" text null, "slug" text not null, "isBestForYou" boolean not null default false, "isPublished" boolean not null default false, "publishedAt" timestamptz null, "createdAt" timestamptz not null default ()=>new Date(), "updatedAt" timestamptz not null default ()=>new Date(), "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "post_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_post_deleted_at" ON "post" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "post" cascade;`);
  }

}
