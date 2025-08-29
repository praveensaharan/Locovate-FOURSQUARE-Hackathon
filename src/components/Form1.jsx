import { useState, useRef } from "react";
import { Mic, Smile } from "lucide-react";

const predefinedMoods = ["Happy", "Relaxed", "Energetic", "Calm", "Focused"];

export default function AudioOrMoodChooser({ onTranscript, onMoodSelect }) {
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState(null);
  const [transcript, setTranscript] = useState("");

  const recognitionRef = useRef(null);

  const startRecording = () => {
    setError(null);
    setTranscript("");

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      const finalTranscript = event.results[0][0].transcript.trim();
      setTranscript(finalTranscript);
      setRecording(false);
      if (onTranscript) onTranscript(finalTranscript);
    };

    recognition.onerror = (event) => {
      setError("Error: " + event.error);
      setRecording(false);
    };

    recognition.onend = () => {
      setRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setRecording(true);
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setRecording(false);
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-6 rounded-2xl max-w-md mx-auto bg-[#0B0B2B]/70 backdrop-blur-lg border border-[#4A4CFF]/20 shadow-[0_0_20px_rgba(74,76,255,0.2)]">
      {/* Heading */}
      <h2 className="text-3xl font-bold text-white drop-shadow-lg">
        Tell me your mood
      </h2>
      <p className="text-sm text-[#B9B9FF] text-center">
        Speak or pick a mood below to continue
      </p>

      {/* Mic button */}
      <div className="flex items-center space-x-3 w-full justify-center">
        <button
          onClick={recording ? stopRecording : startRecording}
          className={`p-5 rounded-full transition-all shadow-md border border-[#4A4CFF]/40 hover:shadow-[0_0_20px_rgba(74,76,255,0.6)]
            ${
              recording
                ? "bg-gradient-to-r from-red-500 to-red-600 text-white"
                : "bg-gradient-to-r from-[#4A4CFF] to-[#5865F2] text-white"
            }`}
          aria-label={recording ? "Stop recording" : "Start recording"}
          title={recording ? "Stop recording" : "Record your voice"}
        >
          <Mic size={28} />
        </button>
        <span className="text-sm text-gray-300">
          {recording ? "Listening..." : "Tap mic to talk"}
        </span>
      </div>

      {/* Transcript box */}
      {transcript && (
        <div className="w-full p-3 rounded-lg text-sm bg-[#0F0F35]/60 backdrop-blur border border-[#4A4CFF]/30 text-gray-200">
          <span className="font-semibold text-[#B9B9FF]">You said:</span> {transcript}
        </div>
      )}

      <div className="my-4 border-t border-[#4A4CFF]/20 w-full" />

      {/* Mood buttons */}
      <div className="flex flex-col items-center space-y-3 w-full">
        <div className="flex items-center space-x-2">
          <Smile size={22} className="text-[#B9B9FF]" />
          <h3 className="text-lg font-medium text-white">Or pick a mood</h3>
        </div>
        <div className="grid grid-cols-3 gap-3 w-full">
          {predefinedMoods.map((mood) => (
            <button
              key={mood}
              onClick={() => onMoodSelect && onMoodSelect(mood)}
              className="py-2 px-3 rounded-lg text-sm text-gray-200 bg-[#0B0B2B]/60 border border-[#4A4CFF]/30 hover:bg-[#4A4CFF]/20 hover:shadow-[0_0_10px_rgba(74,76,255,0.4)] transition-all"
              aria-label={`Select mood ${mood}`}
              title={`Select mood ${mood}`}
            >
              {mood}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
    </div>
  );
}
