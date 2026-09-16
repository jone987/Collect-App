import { createClient } from "@/utils/supabase/server";
import type { CustomerStatus } from "@/types/database";

export interface CustomerFilters {
  search?: string;
  status?: CustomerStatus | "all";
}

export async function getCustomers(filters: CustomerFilters = {}) {
  const supabase = await createClient();
  let query = supabase
    .from("customers")
    .select("*")
    .order("created_at", { ascending: false });

  if (filters.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }
  if (filters.search) {
    query = query.ilike("name", `%${filters.search}%`);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}

export async function getCustomer(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

export interface CustomerStats {
  totalCustomers: number;
  outstandingBalance: number;
  overdueCustomers: number;
}

/** Sum of amount owed by customers who aren't paid or closed out. */
export async function getCustomerStats(): Promise<CustomerStats> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("customers")
    .select("amount_owed, status");

  if (error) throw new Error(error.message);

  const rows = data ?? [];
  const outstandingBalance = rows
    .filter((row) => row.status === "active" || row.status === "overdue")
    .reduce((sum, row) => sum + Number(row.amount_owed), 0);
  const overdueCustomers = rows.filter(
    (row) => row.status === "overdue"
  ).length;

  return {
    totalCustomers: rows.length,
    outstandingBalance,
    overdueCustomers,
  };
}
