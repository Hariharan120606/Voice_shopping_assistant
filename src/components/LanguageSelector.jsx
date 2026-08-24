import { Globe } from "lucide-react";
import { SUPPORTED_LANGUAGES } from "../hooks/useVoiceRecognition";

export default function LanguageSelector({ lang, setLang }) {
  return (
    <div className="flex items-center gap-1.5 text-gray-500">
      <Globe className="w-4 h-4" />
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value)}
        className="bg-transparent text-sm font-medium text-gray-600 focus:outline-none"
        aria-label="Voice command language"
      >
        {SUPPORTED_LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>
    </div>
  );
}
