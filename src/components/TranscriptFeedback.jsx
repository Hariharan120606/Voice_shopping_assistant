import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

export default function TranscriptFeedback({ interim, lastAction, error, isListening }) {
  if (error) {
    return (
      <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2.5">
        <AlertCircle className="w-4 h-4 shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  if (isListening) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-100 rounded-xl px-4 py-2.5 min-h-[42px]">
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        <span className="italic">{interim || "Listening..."}</span>
      </div>
    );
  }

  if (lastAction) {
    return (
      <div className="flex items-center gap-2 text-sm text-brand-700 bg-brand-50 rounded-xl px-4 py-2.5 min-h-[42px]">
        <CheckCircle2 className="w-4 h-4 shrink-0" />
        <span>{lastAction}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center text-sm text-gray-400 bg-gray-50 rounded-xl px-4 py-2.5 min-h-[42px]">
      Tap the mic and say something like "Add 2 bottles of water"
    </div>
  );
}
