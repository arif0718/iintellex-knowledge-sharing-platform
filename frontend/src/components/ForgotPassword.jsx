import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/v1/user/forgot-password", { email });
      toast.success("Password reset link sent to your email.");
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-white to-[#4a6d95] px-2">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md bg-white/80 shadow-2xl rounded-xl p-6 sm:p-8 flex flex-col items-center">
        <img src="/iintellex-logo.png" alt="logo" className="w-24 mb-4" />
        <h2 className="text-xl sm:text-2xl font-bold mb-2 text-center text-[#29436e]">Forgot Password</h2>
        <p className="text-xs sm:text-sm text-gray-600 mb-4 text-center">
          Enter your email address and we'll send you a link to reset your password.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4a6d95] bg-white text-sm"
          />
          <button
            type="submit"
            className="bg-[#0095F6] hover:bg-[#258bcf] text-white text-base font-semibold rounded-md py-2 transition"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
