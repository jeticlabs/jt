"use client"
import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { JeticIcon } from "@/components/jetic-icon";
import { useRouter } from "next/navigation";
import CodeSlots, { type CodeSlotsStatus } from "@/components/code-slot";
import {
  establishBrowserSession,
  githubSignInUrl,
  requestEmailCode,
  resendEmailCode,
  verifyEmailCode,
  verifyPassword,
} from "@/features/auth/auth.api";
import { postAuthDestination } from "@/features/auth/redirect";
import { useResendCountdown } from "@/features/auth/use-resend-countdown";


const GitHubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.17c-3.2.7-3.88-1.36-3.88-1.36-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.41-5.25 5.69.41.35.78 1.04.78 2.1v3.11c0 .31.21.68.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
  </svg>
);

type Step = "email" | "code" | "password";

export default function SignUp() {
  const [email, setEmail] = useState<string>("");
  const [step, setStep] = useState<Step>("email");
  const [status, setStatus] = useState<CodeSlotsStatus>("idle");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [codeResent, setCodeResent] = useState(false);
  const [challengeToken, setChallengeToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const resendCountdown = useResendCountdown();
  const navigate = useRouter();
  const handleGitHub = () => {
    const next = new URLSearchParams(window.location.search).get("next");
    window.location.assign(githubSignInUrl(next));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const normalizedEmail = email.trim();
    if (!normalizedEmail || isLoading) return;

    setIsLoading(true);
    setErrorMessage(null);
    try {
      await requestEmailCode("sign-up", normalizedEmail);
      setEmail(normalizedEmail);
      setStatus("idle");
      setCodeResent(false);
      setStep("code");
      resendCountdown.start();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to send a code.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = async (code: string) => {
    if (isLoading) return;
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const result = await verifyEmailCode(email, code);
      if (result.requiresPassword) {
        setChallengeToken(result.challengeToken);
        setPassword("");
        setStatus("idle");
        setStep("password");
        return;
      }
      await establishBrowserSession(result.token);
      setStatus("success");
      window.setTimeout(() => navigate.push(postAuthDestination()), 700);
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Unable to verify that code.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!challengeToken || !password || isLoading) return;

    setIsLoading(true);
    setErrorMessage(null);
    try {
      const token = await verifyPassword(challengeToken, password);
      await establishBrowserSession(token);
      setStatus("success");
      window.setTimeout(() => navigate.push(postAuthDestination()), 700);
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Incorrect password.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setErrorMessage(null);
    setCodeResent(false);
    try {
      await resendEmailCode(email);
      setStatus("idle");
      setCodeResent(true);
      resendCountdown.start();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to resend the code.");
    } finally {
      setIsLoading(false);
    }
  };

  const backToEmail = () => {
    setStatus("idle");
    setErrorMessage(null);
    setCodeResent(false);
    setChallengeToken(null);
    setPassword("");
    resendCountdown.reset();
    setStep("email");
  };

  return (
    <main className="jetic-surface flex min-h-screen items-center justify-center px-4">
      <div className="flex w-full max-w-[405px] flex-col items-center">
        <JeticIcon />

        <h1 className="mt-12 text-center text-[28px] font-semibold leading-[1.15] tracking-tight">
          {step === "email" ? (
            <>
              Create your account
              <div className="jetic-muted flex">Start with a free Hobby workspace</div>
            </>
          ) : step === "code" ? (
            <>
              Verify your email
              <span className="jetic-muted mt-2 block text-[15px] font-normal leading-6">
                We sent a 6-digit code to <span className="text-white">{email}</span>
              </span>
            </>
          ) : (
            <>
              Enter your password
              <span className="jetic-muted mt-2 block text-[15px] font-normal leading-6">
                Password verification is required for <span className="text-white">{email}</span>.
              </span>
            </>
          )}
        </h1>

        {step === "email" ? (
          <div className="mt-10 w-full">
            <button
              type="button"
              onClick={handleGitHub}
              className="jetic-btn-light flex items-center justify-center gap-2.5"
            >
              <span className="jetic-muted">
                <GitHubIcon />
              </span>
              Sign up with GitHub
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
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="Enter your work email..."
                autoComplete="email"
                required
                className="jetic-input"
              />
              <button
                type="submit"
                className="jetic-btn"
                disabled={isLoading}
              >
                {isLoading ? "Sending code..." : "Continue"}
              </button>
            </form>

            {errorMessage && (
              <p role="alert" className="mt-4 text-[14px] text-[#ff3b30]">
                {errorMessage}
              </p>
            )}

            <p className="jetic-muted mt-6 text-center text-[14px]">
              Already have an account?{" "}
              <Link href="/sign-in" className="font-medium text-white hover:underline">
                Log in
              </Link>
            </p>
          </div>
        ) : step === "code" ? (
          <div className="mt-10 flex w-full flex-col items-center">
            <CodeSlots
              length={6}
              status={status}
              onChange={() => {
                setStatus("idle");
                setErrorMessage(null);
              }}
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
              disabled={isLoading}
              autoFocus
            />

            <p className="jetic-muted mt-4 min-h-4 text-center text-[12px] tabular-nums">
              {resendCountdown.active
                ? `Resend code in ${resendCountdown.label}`
                : "You can request a new code."}
            </p>

            {errorMessage && (
              <p role="alert" className="mt-4 text-[14px] text-[#ff3b30]">
                {errorMessage}
              </p>
            )}
            {status === "success" && (
              <p role="status" className="mt-4 text-[14px] text-[#ededed]">
                Verified. Setting things up…
              </p>
            )}

            {codeResent && (
              <p role="status" className="mt-4 text-[14px] text-[#ededed]">
                A new code has been sent to your email.
              </p>
            )}

            <button
              type="button"
              onClick={handleResendCode}
              disabled={isLoading || resendCountdown.active}
              className="jetic-muted mt-6 text-[14px] font-medium hover:text-white hover:underline disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Sending code..." : "Resend code"}
            </button>

            <button
              type="button"
              onClick={backToEmail}
              disabled={isLoading}
              className="jetic-muted mt-3 text-[14px] font-medium hover:text-white hover:underline"
            >
              Use a different email
            </button>
          </div>
        ) : (
          <div className="mt-10 flex w-full flex-col items-center">
            <form onSubmit={handlePasswordSubmit} className="flex w-full flex-col gap-4">
              <input
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setErrorMessage(null);
                }}
                placeholder="Password"
                autoComplete="current-password"
                autoFocus
                disabled={isLoading}
                className="jetic-input"
              />
              <button type="submit" className="jetic-btn" disabled={isLoading || !password}>
                {isLoading ? "Checking password..." : "Continue"}
              </button>
            </form>

            {errorMessage && (
              <p role="alert" className="mt-4 text-[14px] text-[#ff3b30]">
                {errorMessage}
              </p>
            )}
            {status === "success" && (
              <p role="status" className="mt-4 text-[14px] text-[#ededed]">
                Verified. Setting things up…
              </p>
            )}

            <button
              type="button"
              onClick={backToEmail}
              disabled={isLoading}
              className="jetic-muted mt-6 text-[14px] font-medium hover:text-white hover:underline"
            >
              Cancel and sign out
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
