"use client"
import { useState } from "react";
import type { FormEvent } from "react";
import { JeticIcon } from "@/components/jetic-icon";
import { useRouter } from "next/navigation";
import CodeSlots, { type CodeSlotsStatus } from "@/components/code-slot";



const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81Z" />
  </svg>
);

type Step = "email" | "code";

// TODO: replace with a real call to your verify endpoint.
async function verifyCode(code: string): Promise<boolean> {
  console.log("Verify code:", code);
  await new Promise((r) => setTimeout(r, 400));
  return true;
}

export default function SignIn() {
  const [email, setEmail] = useState<string>("");
  const [step, setStep] = useState<Step>("email");
  const [status, setStatus] = useState<CodeSlotsStatus>("idle");
  const navigate = useRouter();
  const handleGoogle = () => {
    // TODO: hook up Google OAuth
    console.log("Continue with Google");
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) return;
    // TODO: send the one-time code to the email via backend
    console.log("Send code to:", email);
    setStatus("idle");
    setStep("code");
  };

  const handleComplete = async (code: string) => {
    const ok = await verifyCode(code);
    if (!ok) {
      setStatus("error");
      return;
    }
    setStatus("success");
    // Let the success animation play before leaving.
    window.setTimeout(() => navigate.push("/app/onboarding"), 700);
  };

  const backToEmail = () => {
    setStatus("idle");
    setStep("email");
  };

  return (
    <main className="jetic-surface flex min-h-screen items-center justify-center px-4">
      <div className="flex w-full max-w-[405px] flex-col items-center">
        <JeticIcon />

        <h1 className="mt-12 text-center text-[28px] font-semibold leading-[1.15] tracking-tight">
          {step === "email" ? (
            <>
              Welcome to Jetic
              <div className="jetic-muted flex">The agentic api workspace</div>
            </>
          ) : (
            <>
              Verify your email
              <span className="jetic-muted mt-2 block text-[15px] font-normal leading-6">
                We sent a 6-digit code to <span className="text-white">{email}</span>
              </span>
            </>
          )}
        </h1>

        {step === "email" ? (
          <div className="mt-10 w-full">
            <button
              type="button"
              onClick={handleGoogle}
              className="jetic-btn-light flex items-center justify-center gap-2.5"
            >
              <span className="jetic-muted">
                <GoogleIcon />
              </span>
              Continue with Google
            </button>

            <div className="my-5 flex items-center gap-3 px-2" role="separator" aria-label="or">
              <div className="jetic-divider" />
              <span className="jetic-muted text-xs">OR</span>
              <div className="jetic-divider" />
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your work email..."
                autoComplete="email"
                className="jetic-input"
              />
              <button
                type="submit"
                className="jetic-btn"
              >
                Continue
              </button>
            </form>
          </div>
        ) : (
          <div className="mt-10 flex w-full flex-col items-center">
            <CodeSlots
              length={6}
              status={status}
              onChange={() => setStatus("idle")}
              onComplete={handleComplete}
              accentColor="#f5f5f5"
              inkColor="#f5f5f5"
              slotColor="#27272a"
              digitColor="#18181b"
              dangerColor="#ff3b30"
              slotSize={44}
              gap={8}
              radius={12}
              bounce={0.2}
              settle={0.3}
              rise={8}
              cascade={20}
              mask={false}
              caret
              disabled={false}
              autoFocus
            />

            {status === "error" && (
              <p role="alert" className="mt-4 text-[14px] text-[#ff3b30]">
                That code didn&apos;t match — try again.
              </p>
            )}
            {status === "success" && (
              <p role="status" className="mt-4 text-[14px] text-[#ededed]">
                Verified. Taking you in…
              </p>
            )}

            <button
              type="button"
              onClick={backToEmail}
              className="jetic-muted mt-6 text-[14px] font-medium hover:text-white hover:underline"
            >
              Use a different email
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
