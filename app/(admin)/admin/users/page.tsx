"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";

type AdminUser = {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role?: string;
  createdAt?: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [q, setQ] = useState("");
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async (args?: { page?: number; limit?: number; q?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.admin.getAllUsers({
        page: args?.page ?? page,
        limit: args?.limit ?? limit,
        q: args?.q ?? q,
      });
      setUsers((data as { users?: AdminUser[] }).users || []);
      setPage((data as { page?: number }).page ?? page);
      setLimit((data as { limit?: number }).limit ?? limit);
      setTotal((data as { total?: number }).total ?? 0);
      setTotalPages((data as { totalPages?: number }).totalPages ?? 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-8 bg-black min-h-full">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold text-white">Users</h1>

        {/* Controls */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name or email"
              className="w-64 rounded-md bg-slate-900 border border-slate-800 px-3 py-2 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-600"
            />
            <button
              onClick={() => {
                setPage(1);
                fetchUsers({ page: 1, limit, q });
              }}
              className="rounded-md bg-cyan-600 px-3 py-2 text-sm font-medium text-white hover:bg-cyan-500"
            >
              Search
            </button>
          </div>
          <div className="text-sm text-slate-400">
            {total.toLocaleString()} total • Page {page} of {totalPages}
          </div>
        </div>

        {loading ? (
          <div className="text-slate-400">Loading users...</div>
        ) : error ? (
          <div className="text-red-400">{error}</div>
        ) : users.length === 0 ? (
          <div className="text-slate-400">No users found.</div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-slate-800">
            <table className="min-w-full divide-y divide-slate-800">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {users.map((u) => {
                  const id = u.id || u._id || "";
                  const created = u.createdAt ? new Date(u.createdAt).toLocaleString() : "";
                  return (
                    <tr key={id} className="hover:bg-slate-900/30">
                      <td className="px-4 py-3 text-slate-200">{u.name}</td>
                      <td className="px-4 py-3 text-slate-400">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-md bg-slate-800 px-2 py-1 text-xs font-medium text-slate-300 ring-1 ring-inset ring-slate-700">
                          {u.role || "user"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400">{created}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination controls */}
        <div className="flex items-center justify-end gap-2">
          <button
            disabled={page <= 1 || loading}
            onClick={() => {
              const next = Math.max(1, page - 1);
              setPage(next);
              fetchUsers({ page: next, limit, q });
            }}
            className="rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-300 disabled:opacity-50"
          >
            Prev
          </button>
          <button
            disabled={page >= totalPages || loading}
            onClick={() => {
              const next = Math.min(totalPages, page + 1);
              setPage(next);
              fetchUsers({ page: next, limit, q });
            }}
            className="rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
