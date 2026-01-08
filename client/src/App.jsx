import { useState } from "react";
import "./App.css";
import { OtpInput } from "./components/OtpInput";

function App() {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSendOtp = async () => {
    if (!email || isSending) return;
    setIsSending(true);
    try {
      // Replace with real API call to send OTP
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setOtpSent(true);
    } finally {
      setIsSending(false);
    }
  };
  return (
    <div className="app-container">
      <div className="card">
        <div className="card-header">
          <h1 className="title">Email Verification</h1>
          <p className="subtitle">We’ll send a one-time code to your email.</p>
        </div>

        <form className="email-form" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="email" className="label">
            Email address
          </label>
          <div className="input-row">
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="input"
              aria-label="Email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="button"
              className={`btn primary ${isSending ? "loading" : ""}`}
              disabled={email.length === 0 || isSending}
              onClick={handleSendOtp}
            >
              {isSending && <span className="spinner" aria-hidden="true" />}
              <span className="btn-label">
                {isSending ? "Sending…" : "Send OTP"}
              </span>
            </button>
          </div>
        </form>
        {otpSent && (
          <div className="otp-section">
            <OtpInput />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
