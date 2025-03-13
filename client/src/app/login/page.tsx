"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLoginUserMutation } from "@/state/api";
import { TextField } from "@mui/material";

const Login = () => {
  const router = useRouter();
  const [loginUser, { isLoading, error }] = useLoginUserMutation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await loginUser(formData).unwrap();
      localStorage.setItem("token", response.token!);
      router.push("/dashboard");
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
        <div className="mb-8">
          <TextField
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            error={Boolean(error)}
            onChange={handleChange}
            className={`w-full p-2 mb-4 border rounded focus:ring-2 focus:ring-blue-500 ${
              error ? "border-red-500" : ""
            }`}
            required
          />
        </div>
        <TextField
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          error={Boolean(error)}
          onChange={handleChange}
          className={`w-full p-2 mb-4 border rounded focus:ring-2 focus:ring-blue-500 ${
            error ? "border-red-500" : ""
          }`}
          required
        />
        {error && <p className="text-red-500">Invalid credentials</p>}
        <button
          type="submit"
          className="w-full py-2 btn-primary mt-8"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
