import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Nav } from "@/app/components/Nav";
import { NewFollowUpForm } from "./new-follow-up-form";
import { FollowUpRow } from "./follow-up-row";
import { CustomerStatusSelect } from "./customer-status-select";
import { DeleteCustomerButton } from "./delete-customer-button";

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: customer } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .single();

  if (!customer) notFound();

  const { data: followUps } = await supabase
    .from("follow_ups")
    .select("*")
    .eq("customer_id", id)
    .order("due_date", { ascending: true, nullsFirst: false });

  return (
    <div>
      <Nav />
      <main className="mx-auto max-w-5xl space-y-6 px-6 py-8">
        <Link href="/customers" className="text-sm text-gray-500 hover:underline">
          ← Back to customers
        </Link>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-semibold">{customer.name}</h1>
              <p className="text-sm text-gray-500">
                {customer.job ?? "No job set"} · {customer.contact ?? "No contact"}
              </p>
            </div>
            <DeleteCustomerButton customerId={customer.id} />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase text-gray-400">Amount owed</p>
              <p className="text-lg font-semibold">
                ${Number(customer.amount_owed).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-400">Status</p>
              <CustomerStatusSelect
                customerId={customer.id}
                status={customer.status}
              />
            </div>
            {customer.notes && (
              <div className="sm:col-span-3">
                <p className="text-xs uppercase text-gray-400">Notes</p>
                <p className="text-sm text-gray-700">{customer.notes}</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-lg font-semibold">Follow-ups</h2>
          <div className="space-y-4">
            <NewFollowUpForm customerId={customer.id} />

            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Reason</th>
                    <th className="px-4 py-3">Due date</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Notes</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {followUps?.map((followUp) => (
                    <FollowUpRow key={followUp.id} followUp={followUp} />
                  ))}
                  {followUps?.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-8 text-center text-gray-400"
                      >
                        No follow-ups yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
