import React, { useState, useEffect } from "react";
import "./AuthModal.css";
import AuthTabs from "../AuthTabs/AuthTabs";
import SignUpForm from "../SignUpForm/SignUpForm";
import SignInForm from "../SignInForm/SignInForm";
import OrgSignupForm from "../OrgSignUpForm/OrgSignUpForm";

export default function AuthModal({ open = true, onClose, onOrgSignup = true ,onRegister=true}) {
  const [activeTab, setActiveTab] = useState("signup");

  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!open) return null;

  return (<>
    <div className="am-overlay" onClick={onClose}>
      {!onOrgSignup && <div
        className="am-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >

        <AuthTabs active={activeTab} onChange={setActiveTab} />

        <div className="am-body">
          <h2 className="am-title">
            {activeTab === "signup" ? "Create an account" : "Welcome back"}
          </h2>

          {activeTab === "signup" ? (
            <SignUpForm onSubmit={(data) => console.log("Signup:", data)} />
          ) : (
            <SignInForm onSubmit={(data) => console.log("Signin:", data)} />
          )}
        </div>
      </div>}

      {onOrgSignup && <OrgSignupForm  onRegister={onRegister} />}
    </div>
  </>
  );
}
