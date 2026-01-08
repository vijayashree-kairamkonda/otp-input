import { useState } from "react";
import "./App.css";
import { OtpInput } from "./components/OtpInput";
import { sendOtp, verifyOtp } from "./services/api";

function App() {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null); // { type, message }
  const [otpStatus, setOtpStatus] = useState(null); // { type, message }

  const handleSendOtp = async () => {
    if (!email || isSending) return;
    setIsSending(true);
    setEmailStatus(null);
    try {
      await sendOtp(email);
      setOtpSent(true);
      setEmailStatus({ type: "success", message: "OTP sent successfully." });
    } catch (err) {
      setEmailStatus({
        type: "error",
        message: err?.message || "Failed to send OTP.",
      });
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
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailStatus(null);
              }}
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
          {emailStatus && (
            <div className={`form-message ${emailStatus.type}`}>
              {emailStatus.message}
            </div>
          )}
        </form>
        {/* {otpSent && ( */}
        <div className="otp-section">
          <OtpInput
            status={otpStatus}
            onSubmit={async (otp) => {
              setOtpStatus(null);
              try {
                await verifyOtp(email, otp);
                setOtpStatus({
                  type: "success",
                  message: "Email verification successful.",
                });
              } catch (err) {
                setOtpStatus({
                  type: "error",
                  message: err?.message || "Failed to verify OTP.",
                });
                throw err;
              }
            }}
          />
        </div>
        {/* )} */}
      </div>
    </div>
  );
}

export default App;
