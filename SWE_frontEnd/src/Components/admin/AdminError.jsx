import { XCircle } from "lucide-react";

export default function AdminError({ error }) {
  if (!error) return null;

  return (
    <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 mb-6 flex items-center gap-3">
            <XCircle className="w-5 h-5 shrink-0" />

            <p className="font-bold text-sm">
              {error}
            </p>
          </div>
        )}

