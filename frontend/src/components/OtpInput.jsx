import React, { useRef } from "react";

/**
 * Controlled OTP box group.
 * value / onChange work with a plain string, e.g. "482913".
 */
export default function OtpInput({ length = 6, value, onChange, hasError }) {
  const inputsRef = useRef([]);
  const digits = value.split("");

  const setDigit = (index, char) => {
    const next = value.split("");
    next[index] = char;
    onChange(next.join("").slice(0, length));
  };

  const handleChange = (e, index) => {
    const char = e.target.value.replace(/[^0-9]/g, "").slice(-1);
    setDigit(index, char || "");
    if (char && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "");
    if (!pasted) return;
    e.preventDefault();
    onChange(pasted.slice(0, length));
    const lastIndex = Math.min(pasted.length, length) - 1;
    inputsRef.current[lastIndex]?.focus();
  };

  return (
    <div className="otp-inputs" onPaste={handlePaste}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={1}
          className={`otp-box${hasError ? " has-error" : ""}`}
          value={digits[i] || ""}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          aria-label={`Digit ${i + 1} of ${length}`}
        />
      ))}
    </div>
  );
}
