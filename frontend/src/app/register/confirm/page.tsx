"use client";

import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { confirmSignUp, resendSignUpCode } from "aws-amplify/auth";
import { useRouter, useSearchParams } from "next/navigation";

const schema = z.object({
  code: z.string().length(6, "Enter the 6-digit code from your email"),
});

type FormValues = z.infer<typeof schema>;

function ConfirmForm() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") ?? "";
  const [serverError, setServerError] = useState<string | null>(null);
  const [resent, setResent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setServerError(null);
    try {
      await confirmSignUp({ username: email, confirmationCode: values.code });
      router.push("/login");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Confirmation failed.";
      setServerError(message);
    }
  }

  async function handleResend() {
    try {
      await resendSignUpCode({ username: email });
      setResent(true);
    } catch {
      setServerError("Could not resend code. Please try again.");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-brand-50 px-4">
      <div className="card w-full max-w-md">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Check your email</h1>
        <p className="text-slate-600 mb-6">
          We sent a 6-digit code to <strong>{email}</strong>.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div>
            <label htmlFor="code" className="label">
              Verification code
            </label>
            <input
              id="code"
              type="text"
              inputMode="numeric"
              maxLength={6}
              className="input tracking-widest text-center text-xl"
              aria-describedby={errors.code ? "code-error" : undefined}
              {...register("code")}
            />
            {errors.code && (
              <p id="code-error" className="error-text" role="alert">
                {errors.code.message}
              </p>
            )}
          </div>

          {serverError && (
            <p className="error-text" role="alert">
              {serverError}
            </p>
          )}
          {resent && (
            <p className="text-sm text-success-700" role="status">
              Code resent — check your email.
            </p>
          )}

          <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
            {isSubmitting ? "Confirming…" : "Confirm account"}
          </button>
        </form>

        <button
          type="button"
          onClick={handleResend}
          className="mt-3 text-sm text-brand-600 hover:underline w-full text-center"
        >
          Resend code
        </button>
      </div>
    </main>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p>Loading…</p></div>}>
      <ConfirmForm />
    </Suspense>
  );
}
