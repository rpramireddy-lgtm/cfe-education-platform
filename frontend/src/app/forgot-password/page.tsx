"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { resetPassword, confirmResetPassword } from "aws-amplify/auth";
import Link from "next/link";

const requestSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

const confirmSchema = z
  .object({
    code: z.string().length(6, "Enter the 6-digit code"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RequestValues = z.infer<typeof requestSchema>;
type ConfirmValues = z.infer<typeof confirmSchema>;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const requestForm = useForm<RequestValues>({ resolver: zodResolver(requestSchema) });
  const confirmForm = useForm<ConfirmValues>({ resolver: zodResolver(confirmSchema) });

  async function onRequest(values: RequestValues) {
    setServerError(null);
    try {
      await resetPassword({ username: values.email });
      setEmail(values.email);
      setCodeSent(true);
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : "Request failed.");
    }
  }

  async function onConfirm(values: ConfirmValues) {
    setServerError(null);
    try {
      await confirmResetPassword({
        username: email,
        confirmationCode: values.code,
        newPassword: values.newPassword,
      });
      setDone(true);
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : "Reset failed.");
    }
  }

  if (done) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-brand-50 px-4">
        <div className="card w-full max-w-md text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Password reset</h1>
          <p className="text-slate-600 mb-4">Your password has been updated.</p>
          <Link href="/login" className="btn-primary">
            Sign in
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-brand-50 px-4">
      <div className="card w-full max-w-md">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Reset password</h1>

        {!codeSent ? (
          <form onSubmit={requestForm.handleSubmit(onRequest)} noValidate className="space-y-4">
            <div>
              <label htmlFor="email" className="label">
                Email address
              </label>
              <input
                id="email"
                type="email"
                className="input"
                {...requestForm.register("email")}
              />
              {requestForm.formState.errors.email && (
                <p className="error-text" role="alert">
                  {requestForm.formState.errors.email.message}
                </p>
              )}
            </div>
            {serverError && <p className="error-text" role="alert">{serverError}</p>}
            <button
              type="submit"
              className="btn-primary w-full"
              disabled={requestForm.formState.isSubmitting}
            >
              {requestForm.formState.isSubmitting ? "Sending…" : "Send reset code"}
            </button>
          </form>
        ) : (
          <form onSubmit={confirmForm.handleSubmit(onConfirm)} noValidate className="space-y-4">
            <p className="text-slate-600 text-sm">Code sent to <strong>{email}</strong>.</p>
            <div>
              <label htmlFor="code" className="label">Code</label>
              <input id="code" type="text" inputMode="numeric" maxLength={6} className="input" {...confirmForm.register("code")} />
              {confirmForm.formState.errors.code && <p className="error-text" role="alert">{confirmForm.formState.errors.code.message}</p>}
            </div>
            <div>
              <label htmlFor="newPassword" className="label">New password</label>
              <input id="newPassword" type="password" className="input" {...confirmForm.register("newPassword")} />
              {confirmForm.formState.errors.newPassword && <p className="error-text" role="alert">{confirmForm.formState.errors.newPassword.message}</p>}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="label">Confirm password</label>
              <input id="confirmPassword" type="password" className="input" {...confirmForm.register("confirmPassword")} />
              {confirmForm.formState.errors.confirmPassword && <p className="error-text" role="alert">{confirmForm.formState.errors.confirmPassword.message}</p>}
            </div>
            {serverError && <p className="error-text" role="alert">{serverError}</p>}
            <button type="submit" className="btn-primary w-full" disabled={confirmForm.formState.isSubmitting}>
              {confirmForm.formState.isSubmitting ? "Resetting…" : "Reset password"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
