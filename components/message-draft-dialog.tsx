"use client";

import { useEffect, useRef, useState } from "react";
import { Dialog, type DialogHandle } from "@/components/ui/dialog";
import { Button, buttonClassName } from "@/components/ui/button";
import { Textarea } from "@/components/ui/field";
import { formatCurrency, daysOverdue } from "@/lib/format";
import {
  MESSAGE_TONES,
  MESSAGE_TEMPLATES,
  selectTone,
  renderMessageTemplate,
  type MessageTone,
} from "@/lib/message-templates";
import {
  buildMailtoLink,
  buildSmsLink,
  extractEmail,
  extractPhone,
  isIOSDevice,
} from "@/lib/contact-links";

interface DraftMessageDialogProps {
  customerName: string;
  customerJob: string | null;
  amountOwed: number;
  contact: string | null;
  dueDate: string | null;
}

export function DraftMessageDialog({
  customerName,
  customerJob,
  amountOwed,
  contact,
  dueDate,
}: DraftMessageDialogProps) {
  const dialogRef = useRef<DialogHandle>(null);
  const [tone, setTone] = useState<MessageTone>("friendly");
  const [message, setMessage] = useState("");
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">(
    "idle"
  );
  // Set once on mount; only matters at click time (dialog starts closed), so
  // there's no SSR/hydration mismatch to worry about.
  const [isIOS, setIsIOS] = useState(false);
  useEffect(() => setIsIOS(isIOSDevice()), []);

  const overdueDays = daysOverdue(dueDate);
  const mergeFields = {
    name: customerName,
    job: customerJob?.trim() || "project",
    amount: formatCurrency(amountOwed),
    days_overdue: String(overdueDays),
  };

  function applyTone(nextTone: MessageTone) {
    setTone(nextTone);
    setMessage(renderMessageTemplate(nextTone, mergeFields));
  }

  function handleOpen() {
    const defaultTone = selectTone(overdueDays);
    setTone(defaultTone);
    setMessage(renderMessageTemplate(defaultTone, mergeFields));
    setCopyState("idle");
    dialogRef.current?.open();
  }

  const phone = extractPhone(contact);
  const email = extractEmail(contact);
  const subject = customerJob
    ? `Following up on ${customerJob}`
    : "Following up on your balance";

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(message);
      setCopyState("copied");
      setTimeout(() => setCopyState("idle"), 2000);
    } catch {
      setCopyState("error");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="text-xs font-medium text-gray-600 hover:text-gray-900 hover:underline"
      >
        Message
      </button>
      <Dialog
        ref={dialogRef}
        title="Draft a message"
        description={`For ${customerName} — ${
          overdueDays > 0
            ? `${overdueDays} day${overdueDays === 1 ? "" : "s"} overdue`
            : "not yet overdue"
        }`}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {MESSAGE_TONES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => applyTone(t)}
                className={`rounded-md border px-2 py-2 text-left text-xs transition-colors ${
                  tone === t
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span className="block font-medium">
                  {MESSAGE_TEMPLATES[t].label}
                </span>
                <span
                  className={tone === t ? "text-gray-300" : "text-gray-400"}
                >
                  {MESSAGE_TEMPLATES[t].description}
                </span>
              </button>
            ))}
          </div>

          <Textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={7}
            className="text-sm"
          />

          {!phone && !email && (
            <p className="text-xs text-gray-400">
              No phone or email detected in the contact field — Text and
              Email will open with no recipient pre-filled.
            </p>
          )}

          <div className="flex flex-col gap-2 sm:flex-row">
            <a
              href={buildSmsLink(phone, message, isIOS)}
              className={buttonClassName({
                variant: "secondary",
                className: "flex-1",
              })}
            >
              Text
            </a>
            <a
              href={buildMailtoLink(email, subject, message)}
              className={buttonClassName({
                variant: "secondary",
                className: "flex-1",
              })}
            >
              Email
            </a>
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={handleCopy}
            >
              {copyState === "copied"
                ? "Copied!"
                : copyState === "error"
                  ? "Couldn't copy"
                  : "Copy"}
            </Button>
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => dialogRef.current?.close()}
            >
              Close
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
