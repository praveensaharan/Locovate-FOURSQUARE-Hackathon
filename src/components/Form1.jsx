import React, { useState, useRef, useEffect } from "react";
import { Mic, Smile } from "lucide-react";
import MoodPicker from "./FloatingMood";


export default function AudioOrMoodChooser({ onTranscript, onMoodSelect }) {
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [locationEnabled, setLocationEnabled] = useState(true); // new state

  const recognitionRef = useRef(null);

  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (result.state === "granted") {
          setLocationEnabled(true);
        } else if (result.state === "prompt") {
          navigator.geolocation.getCurrentPosition(
            () => setLocationEnabled(true),
            () => setLocationEnabled(false)
          );
        } else {
          setLocationEnabled(false);
        }
      });
    } else {
      navigator.geolocation.getCurrentPosition(
        () => setLocationEnabled(true),
        () => setLocationEnabled(false)
      );
    }
  }, []);

  const startRecording = () => {
    setError(null);
    setTranscript("");

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Speech recognition is not supported in this browser.");
      return;
    }

    if (!locationEnabled) {
      setError("Location access is required to use this feature.");
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
    <div className="flex flex-col items-center space-y-6 p-6 rounded-2xl ">
      {/* Heading */}
      <h2 className="text-3xl font-bold text-white drop-shadow-lg">
        Tell Us your mood
      </h2>
      <p className="text-sm text-[#B9B9FF] text-center">
        Speak or pick a mood below to continue
      </p>

      {!locationEnabled && (
        <p className="text-yellow-400 text-center mb-2">
          Location access is required for best experience. Please enable location services.
        </p>
      )}

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

      {transcript && (
        <div className="w-full p-3 rounded-lg text-sm bg-[#0F0F35]/60 backdrop-blur border border-[#4A4CFF]/30 text-gray-200">
          <span className="font-semibold text-[#B9B9FF]">You said:</span> {transcript}
        </div>
      )}

      <div className="my-4 border-t border-[#4A4CFF]/20 w-full" />

      <div className="flex flex-col items-center space-y-3 w-full">
        <div className="flex items-center space-x-2">
          <Smile size={22} className="text-[#B9B9FF]" />
          <h3 className="text-lg font-medium text-white">Or pick a mood</h3>
        </div>
      </div>
         <MoodPicker onMoodSelect={onMoodSelect} />
      {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
    </div>
  );
}
