import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20251112122000EnsurePostBooleans extends Migration {

  override async up(): Promise<void> {
    // Ensure boolean flags exist on post table
    this.addSql(`alter table "post" add column if not exists "isBestForYou" boolean not null default false;`);
    this.addSql(`alter table "post" add column if not exists "isPublished" boolean not null default false;`);
    this.addSql(`alter table "post" add column if not exists "publishedAt" timestamptz null;`);
    this.addSql(`alter table "post" add column if not exists "thumbnail" text null;`);
  }

  override async down(): Promise<void> {
    // Remove columns if rolling back (safe if exist)
    this.addSql(`alter table "post" drop column if exists "isBestForYou";`);
    this.addSql(`alter table "post" drop column if exists "isPublished";`);
    this.addSql(`alter table "post" drop column if exists "publishedAt";`);
    this.addSql(`alter table "post" drop column if exists "thumbnail";`);
  }

}
