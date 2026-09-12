"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setServerError(null);
    try {
      const { isSignedIn, nextStep } = await signIn({
        username: values.email,
        password: values.password,
      });

      if (isSignedIn) {
        router.push("/parent/dashboard");
        return;
      }

      if (nextStep.signInStep === "CONFIRM_SIGN_UP") {
        router.push(`/register/confirm?email=${encodeURIComponent(values.email)}`);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Sign in failed. Please try again.";
      setServerError(message);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-brand-50 px-4">
      <div className="card w-full max-w-md">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Sign in</h1>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div>
            <label htmlFor="email" className="label">
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="input"
              aria-describedby={errors.email ? "email-error" : undefined}
              {...register("email")}
            />
            {errors.email && (
              <p id="email-error" className="error-text" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="label">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className="input"
              aria-describedby={errors.password ? "password-error" : undefined}
              {...register("password")}
            />
            {errors.password && (
              <p id="password-error" className="error-text" role="alert">
                {errors.password.message}
              </p>
            )}
          </div>

          {serverError && (
            <p className="error-text" role="alert">
              {serverError}
            </p>
          )}

          <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
            {isSubmitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="mt-4 flex flex-col gap-2 text-sm text-center text-slate-600">
          <Link href="/forgot-password" className="hover:underline">
            Forgot your password?
          </Link>
          <span>
            No account?{" "}
            <Link href="/register" className="text-brand-600 font-semibold hover:underline">
              Create one
            </Link>
          </span>
        </div>
      </div>
    </main>
  );
}
