import React from "react";
import "./PhoneInput.css";

const COUNTRIES = [
  { code: "+91", label: "🇮🇳 India" },
  { code: "+1", label: "🇺🇸 United States" },
  { code: "+44", label: "🇬🇧 United Kingdom" },
  { code: "+61", label: "🇦🇺 Australia" },
];

export default function PhoneInput({ value, onChange, country, onCountry }) {
  return (
    <div className="pi-field">
      <label className="pi-label">Phone</label>
      <div className="pi-row">
        <select
          className="pi-code"
          value={country}
          onChange={(e) => onCountry(e.target.value)}
        >
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.label} {c.code}
            </option>
          ))}
        </select>
        <input
          className="pi-input"
          type="tel"
          placeholder="(775) 351-6501"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          inputMode="numeric"
        />
      </div>
    </div>
  );
}
