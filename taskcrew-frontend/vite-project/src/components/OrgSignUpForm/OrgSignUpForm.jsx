import React, { useState } from "react";
import "./OrgSignupForm.css";
import api from "../../utils/axiosInstance";
import {getAccessToken, setAccessToken, clearAuth} from "../../utils/auth";
import {useNavigate} from "react-router-dom";

export default function OrgSignupForm() {
    const [form, setForm] = useState({
    orgName: "",
    domain: "",
    ownerName: "",
    ownerEmail: "",
    password: "",
    phoneNumber: "",
    // inviteEmails: [""],
    // planType: "Free",
    // billingEmail: "",
    // paymentMethod: "",
    // timeZone: "",
    // defaultWorkspaceName: "",
    // brandColor: "#00E5FF",
  });
  const navigate=useNavigate();
  const [error, setError] = useState("");

  const handleChange = (k, v) => {setForm((f) => ({ ...f, [k]: v })); setError("");};
  const handleInviteChange = (i, v) =>
    handleChange(
      "inviteEmails",
      form.inviteEmails.map((e, idx) => (idx === i ? v : e))
    );
  const addInviteField = () =>
    handleChange("inviteEmails", [...form.inviteEmails, ""]);

  const submit = async(e) => {
    e.preventDefault();
    console.log(form);
    try {
        const {data}=await api.post("/api/auth/org/add-organization", form);
        console.log(data);
        setAccessToken(data.accessToken);
        setForm({
            orgName: "",
            domain: "",
            ownerName: "",
            ownerEmail: "",
            password: "",
            phoneNumber: "",
            // inviteEmails: [""],
            // planType: "Free",
            // billingEmail: "",
            // paymentMethod: "",
            // timeZone: "",
            // defaultWorkspaceName: "",
            // brandColor: "#00E5FF",
          });
          navigate("/allOrganizations");

    } catch (error) {
        if(error.response?.data?.message){
            setError(error.response.data.message);
        }
        console.log(error);
    }
  };

  return (
    <form className="org-form" onSubmit={submit}>
        {error && <p className="error" style={{color:"red"}}>{error}</p>}
      <h2 className="org-title">Add Your Organization</h2>

      {/* Organization Identity */}
      <h3 className="org-section">Organization</h3>
      <div className="org-grid">
        <div className="org-field span-2">
          <label>Organization Name</label>
          <input
            type="text"
            placeholder="Acme Corp"
            value={form.orgName}
            onChange={(e) => handleChange("orgName", e.target.value)}
            required
          />
        </div>
        <div className="org-field span-2">
          <label>Domain (optional)</label>
          <input
            type="text"
            placeholder="acme.com"
            value={form.domain}
            onChange={(e) => handleChange("domain", e.target.value)}
          />
        </div>
      </div>

      {/* Owner/Admin */}
      <h3 className="org-section">Owner / Admin</h3>
      <div className="org-grid">
        <div className="org-field">
          <label>Owner Name</label>
          <input
            type="text"
            placeholder="John Doe"
            minLength={2}
            value={form.ownerName}
            onChange={(e) => handleChange("ownerName", e.target.value)}
            required
          />
        </div>
        <div className="org-field">
          <label>Owner Email</label>
          <input
            type="email"
            placeholder="john@acme.com"
            minLength={6}
            value={form.ownerEmail}
            onChange={(e) => handleChange("ownerEmail", e.target.value)}
            required
          />
        </div>
        <div className="org-field">
          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            minLength={6}
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            required
          />
        </div>
        <div className="org-field">
          <label>Phone Number (optional)</label>
          <input
            type="tel"
            placeholder="+91 9876543210"
            value={form.phoneNumber}
            onChange={(e) => handleChange("phoneNumber", e.target.value)}
          />
        </div>
      </div>

      {/* Invite */}
      {/* <h3 className="org-section">Invite Teammates (optional)</h3> */}
      {/* <div className="org-grid">
        <div className="org-field span-2">
          {form.inviteEmails.map((email, i) => (
            <input
              key={i}
              type="email"
              placeholder="teammate@email.com"
              value={email}
              onChange={(e) => handleInviteChange(i, e.target.value)}
              className="stacked"
            />
          ))}
          <button type="button" className="org-add" onClick={addInviteField}>
            + Invite another
          </button>
        </div>
      </div> */}

      {/* Subscription */}
      {/* <h3 className="org-section">Subscription</h3>
      <div className="org-grid">
        <div className="org-field">
          <label>Plan Type</label>
          <select
            value={form.planType}
            onChange={(e) => handleChange("planType", e.target.value)}
          >
            <option>Free</option>
            <option>Pro</option>
            <option>Enterprise</option>
          </select>
        </div>
        <div className="org-field">
          <label>Billing Email</label>
          <input
            type="email"
            placeholder="billing@acme.com"
            value={form.billingEmail}
            onChange={(e) => handleChange("billingEmail", e.target.value)}
          />
        </div>
        <div className="org-field">
          <label>Payment Method (Pro+)</label>
          <select
            value={form.paymentMethod}
            onChange={(e) => handleChange("paymentMethod", e.target.value)}
          >
            <option value="">Select</option>
            <option value="Card">Card</option>
            <option value="UPI">UPI</option>
            <option value="PayPal">PayPal</option>
          </select>
        </div>
      </div> */}

      {/* Settings */}
      {/* <h3 className="org-section">Settings</h3>
      <div className="org-grid">
        <div className="org-field">
          <label>Time Zone</label>
          <input
            type="text"
            placeholder="Asia/Kolkata"
            value={form.timeZone}
            onChange={(e) => handleChange("timeZone", e.target.value)}
          />
        </div>
        <div className="org-field">
          <label>Default Workspace Name</label>
          <input
            type="text"
            placeholder="Marketing Workspace"
            value={form.defaultWorkspaceName}
            onChange={(e) =>
              handleChange("defaultWorkspaceName", e.target.value)
            }
          />
        </div>
        <div className="org-field span-2">
          <label>Brand Color</label>
          <input
            type="color"
            value={form.brandColor}
            onChange={(e) => handleChange("brandColor", e.target.value)}
            className="color"
          />
        </div> */}
      {/* </div> */}

      <button className="org-submit" type="submit">
        Add Organization
      </button>
    </form>
  );
}
