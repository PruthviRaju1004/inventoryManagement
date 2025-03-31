"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useResetPasswordMutation } from "../../state/api";
import { TextField } from "@mui/material";
import { Check, X } from 'lucide-react';

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [resetPassword, { isLoading, isError, error: apiError }] = useResetPasswordMutation();

  const validatePassword = (password: string) => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[@$!%*?&]/.test(password),
    };
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }

    const passwordRequirements = validatePassword(password);
    if (Object.values(passwordRequirements).includes(false)) {
      setError("Password does not meet all requirements.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await resetPassword({ token, password }).unwrap();
      router.push("/login");
    } catch (err) {
      setError("Failed to reset password.");
    }
  };

  const passwordRequirements = validatePassword(password);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-6 bg-white shadow-md rounded-lg w-96">
        <h2 className="text-xl font-semibold text-center mb-4">Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">New Password</label>
          <TextField
            type="password"
            className="w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!error}
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                borderColor: !!error ? 'red' : undefined,
              },
            }}
          />
          <label className="block mt-4 mb-2">Confirm Password</label>
          <TextField
            type="password"
            className="w-full"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={!!error}
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                borderColor: !!error ? 'red' : undefined,
              },
            }}
          />

          {/* Error Message */}
          {error && <p className="text-sm mt-2" style={{color: 'rgb(239, 68, 68)'}}>{error}</p>}

          <button
            type="submit"
            className="w-full py-2 btn-primary mt-8"
            disabled={isLoading}
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>

           {/* Password Requirements */}
           <div className="mt-2 text-sm">
            {[
              { label: "At least 8 characters", valid: passwordRequirements.length },
              { label: "At least one uppercase letter", valid: passwordRequirements.uppercase },
              { label: "At least one lowercase letter", valid: passwordRequirements.lowercase },
              { label: "At least one number", valid: passwordRequirements.number },
              { label: "At least one special character (@$!%*?&)", valid: passwordRequirements.specialChar },
            ].map(({ label, valid }, index) => (
              <p key={index} className={`flex items-center ${valid ? "text-green-600" : "text-red-500"}`}>
                {valid ? (
                  <Check className="mr-1" style={{ color: 'rgb(34, 197, 94)' }} />
                ) : (
                  <X className="mr-1" style={{ color: 'rgb(239, 68, 68)' }} />
                )}{" "}
                {label}
              </p>
            ))}
          </div>
        </form>
      </div>
    </div>
  );
}
