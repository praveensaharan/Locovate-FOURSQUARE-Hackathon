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

    // Check if browser supports
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN"; 
    recognition.interimResults = true; 
    recognition.continuous = true; 

    recognition.onresult = (event) => {
      let finalTranscript = "";
      for (let i = 0; i < event.results.length; i++) {
        finalTranscript += event.results[i][0].transcript;
      }
      setTranscript(finalTranscript);
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
    <div className="flex flex-col items-center space-y-6 p-6 border rounded-xl max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Choose input method</h2>

      {/* Audio Record Option */}
      <div className="flex items-center space-x-3 w-full justify-center">
        <button
          onClick={recording ? stopRecording : startRecording}
          className={`p-4 rounded-full border transition-colors
            ${recording ? "bg-red-500 text-white" : "bg-sky-100 text-sky-700"} 
            hover:bg-red-600 hover:text-white`}
          aria-label={recording ? "Stop recording" : "Start recording"}
          title={recording ? "Stop recording" : "Record your voice"}
        >
          <Mic size={32} />
        </button>
        <span>{recording ? "Listening..." : "Tap mic to talk"}</span>
      </div>

      {/* Transcript box */}
      {transcript && (
        <div className="w-full p-3 border rounded-lg text-sm">
          {transcript}
        </div>
      )}

      {/* Divider */}
      <div className="my-4 border-t w-full" />

      {/* Mood Picker Option */}
      <div className="flex flex-col items-center space-y-3 w-full">
        <div className="flex items-center space-x-2">
          <Smile size={28} className="text-sky-600" />
          <h3 className="text-lg font-medium">Pick a mood</h3>
        </div>
        <div className="grid grid-cols-3 gap-3 w-full">
          {predefinedMoods.map((mood) => (
            <button
              key={mood}
              onClick={() => onMoodSelect && onMoodSelect(mood)}
              className="py-2 px-3 border rounded-lg text-center hover:bg-sky-100 transition"
              aria-label={`Select mood ${mood}`}
              title={`Select mood ${mood}`}
            >
              {mood}
            </button>
          ))}
        </div>
      </div>

      {/* Error display */}
      {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
    </div>
  );
}
