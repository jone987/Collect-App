import Link from "next/link";
import { logout } from "@/app/login/actions";

export function Nav() {
  return (
    <nav className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
      <Link href="/customers" className="text-lg font-semibold">
        COLLECT
      </Link>
      <form action={logout}>
        <button
          type="submit"
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          Sign out
        </button>
      </form>
    </nav>
  );
}
