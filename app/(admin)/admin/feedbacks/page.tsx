"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";

 type Feedback = {
  _id?: string;
  id?: string;
  translationId?: string;
  userId?: string;
  rating: number;
  suggestedText?: string;
  createdAt?: string;
};

export default function AdminFeedbacksPage() {
  const [items, setItems] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [from, setFrom] = useState(""); // ISO string YYYY-MM-DD
  const [to, setTo] = useState("");   // ISO string YYYY-MM-DD
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchFeedbacks = async (args?: { page?: number; limit?: number; from?: string; to?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: args?.page ?? page,
        limit: args?.limit ?? limit,
        from: args?.from ?? (from ? new Date(from).toISOString() : undefined),
        to: args?.to ?? (to ? new Date(to).toISOString() : undefined),
      };
      const data = await api.admin.getAllFeedbacks(params);
      setItems((data as { feedbacks?: Feedback[] }).feedbacks || []);
      setPage((data as { page?: number }).page ?? page);
      setLimit((data as { limit?: number }).limit ?? limit);
      setTotal((data as { total?: number }).total ?? 0);
      setTotalPages((data as { totalPages?: number }).totalPages ?? 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load feedbacks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-8 bg-black min-h-full">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold text-white">Feedbacks</h1>

        {/* Controls */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="rounded-md bg-slate-900 border border-slate-800 px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-600"
            />
            <span className="text-slate-400">to</span>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="rounded-md bg-slate-900 border border-slate-800 px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-600"
            />
            <button
              onClick={() => {
                setPage(1);
                fetchFeedbacks({ page: 1, limit, from, to });
              }}
              className="rounded-md bg-cyan-600 px-3 py-2 text-sm font-medium text-white hover:bg-cyan-500"
            >
              Apply
            </button>
          </div>
          <div className="text-sm text-slate-400">
            {total.toLocaleString()} total • Page {page} of {totalPages}
          </div>
        </div>

        {loading ? (
          <div className="text-slate-400">Loading feedbacks...</div>
        ) : error ? (
          <div className="text-red-400">{error}</div>
        ) : items.length === 0 ? (
          <div className="text-slate-400">No feedbacks found.</div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-slate-800">
            <table className="min-w-full divide-y divide-slate-800">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Rating</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Suggested</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Translation</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">User</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {items.map((f) => {
                  const id = f.id || f._id || Math.random().toString(36);
                  const created = f.createdAt ? new Date(f.createdAt).toLocaleString() : "";
                  return (
                    <tr key={id} className="hover:bg-slate-900/30">
                      <td className="px-4 py-3 text-slate-200">{f.rating}</td>
                      <td className="px-4 py-3 text-slate-300 max-w-[360px] truncate">{f.suggestedText || "-"}</td>
                      <td className="px-4 py-3 text-slate-400">{f.translationId || ""}</td>
                      <td className="px-4 py-3 text-slate-400">{f.userId || ""}</td>
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
              fetchFeedbacks({ page: next, limit, from, to });
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
              fetchFeedbacks({ page: next, limit, from, to });
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
