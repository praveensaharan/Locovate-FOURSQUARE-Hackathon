import React, { useState } from "react";

export default function StepForm() {
  const [step, setStep] = useState(0);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [nextOptions, setNextOptions] = useState([]);

  const fetchFirstOptions = async () => {
    // Mock API call
    const res = await fetch("/api/first");
    const data = await res.json();
    setOptions(data.options);
    setStep(1);
  };

  const fetchNextOptions = async (choice) => {
    setSelected(choice);
    // Mock API call
    const res = await fetch(`/api/second?choice=${choice}`);
    const data = await res.json();
    setNextOptions(data.options);
    setStep(2);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {step === 0 && (
        <button onClick={fetchFirstOptions}>Start</button>
      )}

      {step === 1 && (
        <div>
          <h2>Choose an option:</h2>
          {options.map((opt, i) => (
            <button
              key={i}
              style={{ display: "block", margin: "8px 0" }}
              onClick={() => fetchNextOptions(opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {step === 2 && (
        <div>
          <h2>You selected: {selected}</h2>
          <h3>Next options:</h3>
          <ul>
            {nextOptions.map((opt, i) => (
              <li key={i}>{opt}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
