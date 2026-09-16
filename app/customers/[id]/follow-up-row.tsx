"use client";

import { useTransition } from "react";
import { deleteFollowUp, updateFollowUpStatus } from "../actions";
import { StatusBadge } from "../status-badge";
import type { FollowUpStatus } from "@/types/database";

interface FollowUp {
  id: string;
  customer_id: string;
  reason: string;
  due_date: string | null;
  status: FollowUpStatus;
  notes: string | null;
}

export function FollowUpRow({ followUp }: { followUp: FollowUp }) {
  const [isPending, startTransition] = useTransition();

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3">{followUp.reason}</td>
      <td className="px-4 py-3 text-gray-600">{followUp.due_date ?? "—"}</td>
      <td className="px-4 py-3">
        <select
          value={followUp.status}
          disabled={isPending}
          onChange={(e) =>
            startTransition(() =>
              updateFollowUpStatus(
                followUp.id,
                followUp.customer_id,
                e.target.value as FollowUpStatus
              )
            )
          }
          className="rounded-md border border-gray-300 px-2 py-1 text-xs"
        >
          <option value="pending">Pending</option>
          <option value="done">Done</option>
          <option value="skipped">Skipped</option>
        </select>
        <span className="ml-2">
          <StatusBadge status={followUp.status} />
        </span>
      </td>
      <td className="px-4 py-3 text-gray-600">{followUp.notes ?? "—"}</td>
      <td className="px-4 py-3 text-right">
        <button
          disabled={isPending}
          onClick={() =>
            startTransition(() =>
              deleteFollowUp(followUp.id, followUp.customer_id)
            )
          }
          className="text-xs text-red-600 hover:underline"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
