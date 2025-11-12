import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20251112120000DropDescription extends Migration {

  override async up(): Promise<void> {
    // Drop the description column if it exists (safe to run)
    this.addSql(`alter table "post" drop column if exists "description";`);
  }

  override async down(): Promise<void> {
    // Re-create the description column as non-null with empty default so down() is safe
    this.addSql(`alter table "post" add column if not exists "description" text not null default '';`);
  }

}
