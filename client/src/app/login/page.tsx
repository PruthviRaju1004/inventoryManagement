"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLoginUserMutation, useGetCurrentUserQuery } from "@/state/api";
import { useAppDispatch } from "../redux";
import { setUser } from "@/state/userSlice";
import { TextField } from "@mui/material";

const Login = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loginUser, { isLoading, error }] = useLoginUserMutation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { data: currentUser, isSuccess } = useGetCurrentUserQuery(undefined, {
    skip: typeof window === "undefined" || !localStorage.getItem("token"),
  });

  useEffect(() => {
    if (isSuccess && currentUser) {
      dispatch(setUser(currentUser));
      router.push("/dashboard");
    }
  }, [isSuccess, currentUser, dispatch, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await loginUser(formData).unwrap();
      if (response.token) {
        localStorage.setItem("token", response.token);
      } else {
        console.error("Token is undefined");
      }
      if (response.user.organizationId) {
        localStorage.setItem("userOrg", response.user.organizationId.toString());
      }
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
        <div className="mb-8">
          <label className="block mb-2">Email</label>
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
        <label className="block mb-2">Password</label>
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
