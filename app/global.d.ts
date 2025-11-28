import type { Database } from "@/lib/supabasetypes";

declare global {
  type Summary = Database["public"]["Tables"]["summaries"]["Row"];
}
