import React from "react";
import "./AuthTabs.css";

export default function AuthTabs({ active, onChange }) {
  return (
    <div className="tabs-wrap" role="tablist" aria-label="Auth tabs">
      <button
        className={`tab-btn ${active === "signup" ? "is-active" : ""}`}
        role="tab"
        aria-selected={active === "signup"}
        onClick={() => onChange("signup")}
      >
        Sign up
      </button>
      <button
        className={`tab-btn ${active === "signin" ? "is-active" : ""}`}
        role="tab"
        aria-selected={active === "signin"}
        onClick={() => onChange("signin")}
      >
        Sign in
      </button>
    </div>
  );
}
