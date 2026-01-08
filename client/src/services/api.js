async function parseJsonSafe(res) {
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    try {
      return await res.json();
    } catch {
      return null;
    }
  }
  // Fallback: try text for debugging
  try {
    const text = await res.text();
    return text ? { message: text } : null;
  } catch {
    return null;
  }
}

export async function sendOtp(email) {
  const res = await fetch("/auth/otp/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email }),
  });
  const data = await parseJsonSafe(res);
  if (!res.ok) throw new Error(data?.message || "Failed to send OTP");
  return data;
}

export async function verifyOtp(email, otp) {
  const res = await fetch("/auth/otp/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, otp }),
  });
  const data = await parseJsonSafe(res);
  if (!res.ok) throw new Error(data?.message || "Failed to verify OTP");
  return data;
}
