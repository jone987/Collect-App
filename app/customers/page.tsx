import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Nav } from "@/app/components/Nav";
import { NewCustomerForm } from "./new-customer-form";
import { StatusBadge } from "./status-badge";

export default async function CustomersPage() {
  const supabase = await createClient();
  const { data: customers, error } = await supabase
    .from("customers")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <Nav />
      <main className="mx-auto max-w-5xl space-y-6 px-6 py-8">
        <div>
          <h1 className="text-xl font-semibold">Customers</h1>
          <p className="text-sm text-gray-500">
            Everyone who owes you money, in one place.
          </p>
        </div>

        <NewCustomerForm />

        {error && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {error.message}
          </p>
        )}

        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Job</th>
                <th className="px-4 py-3">Amount owed</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customers?.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/customers/${customer.id}`}
                      className="font-medium text-gray-900 hover:underline"
                    >
                      {customer.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {customer.contact ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {customer.job ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-900">
                    ${Number(customer.amount_owed).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={customer.status} />
                  </td>
                </tr>
              ))}
              {customers?.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-gray-400"
                  >
                    No customers yet. Add your first one above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
