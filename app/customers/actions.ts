"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { CustomerStatus, FollowUpStatus } from "@/types/database";

export async function createCustomer(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const amountOwedRaw = String(formData.get("amount_owed") ?? "0");

  const { error } = await supabase.from("customers").insert({
    user_id: user.id,
    name: String(formData.get("name") ?? "").trim(),
    contact: String(formData.get("contact") ?? "").trim() || null,
    job: String(formData.get("job") ?? "").trim() || null,
    amount_owed: Number.parseFloat(amountOwedRaw) || 0,
    status: (formData.get("status") as CustomerStatus) ?? "active",
    notes: String(formData.get("notes") ?? "").trim() || null,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/customers");
}

export async function updateCustomerStatus(
  customerId: string,
  status: CustomerStatus
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("customers")
    .update({ status })
    .eq("id", customerId);

  if (error) throw new Error(error.message);

  revalidatePath("/customers");
  revalidatePath(`/customers/${customerId}`);
}

export async function deleteCustomer(customerId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("customers")
    .delete()
    .eq("id", customerId);

  if (error) throw new Error(error.message);

  revalidatePath("/customers");
  redirect("/customers");
}

export async function createFollowUp(customerId: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const dueDate = String(formData.get("due_date") ?? "").trim();

  const { error } = await supabase.from("follow_ups").insert({
    user_id: user.id,
    customer_id: customerId,
    reason: String(formData.get("reason") ?? "").trim(),
    due_date: dueDate || null,
    status: (formData.get("status") as FollowUpStatus) ?? "pending",
    notes: String(formData.get("notes") ?? "").trim() || null,
  });

  if (error) throw new Error(error.message);

  revalidatePath(`/customers/${customerId}`);
}

export async function updateFollowUpStatus(
  followUpId: string,
  customerId: string,
  status: FollowUpStatus
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("follow_ups")
    .update({ status })
    .eq("id", followUpId);

  if (error) throw new Error(error.message);

  revalidatePath(`/customers/${customerId}`);
}

export async function deleteFollowUp(followUpId: string, customerId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("follow_ups")
    .delete()
    .eq("id", followUpId);

  if (error) throw new Error(error.message);

  revalidatePath(`/customers/${customerId}`);
}
