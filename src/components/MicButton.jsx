import { Mic, MicOff } from "lucide-react";

export default function MicButton({ isListening, isSupported, onClick }) {
  if (!isSupported) {
    return (
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
          <MicOff className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-xs text-gray-500 max-w-[200px]">
          Voice input isn't supported in this browser. Try Chrome on desktop or Android.
        </p>
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      aria-label={isListening ? "Stop listening" : "Start voice command"}
      className="relative flex items-center justify-center w-20 h-20 rounded-full focus:outline-none focus:ring-4 focus:ring-brand-200 transition-transform active:scale-95"
    >
      {isListening && (
        <>
          <span className="absolute inset-0 rounded-full bg-brand-400/60 animate-pulseRing" />
          <span className="absolute inset-0 rounded-full bg-brand-400/60 animate-pulseRing [animation-delay:0.4s]" />
        </>
      )}
      <span
        className={`relative z-10 flex items-center justify-center w-20 h-20 rounded-full shadow-lg transition-colors ${
          isListening
            ? "bg-red-500"
            : "bg-brand-500 hover:bg-brand-600"
        }`}
      >
        <Mic className="w-8 h-8 text-white" />
      </span>
    </button>
  );
}
