import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "./ui/button";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/v1/user/reset-password", { token, newPassword });
      toast.success("Password reset successful! You can now login.");
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-white to-[#4a6d95] px-2">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md bg-white/80 shadow-2xl rounded-xl p-6 sm:p-8 flex flex-col items-center">
        <img src="/iintellex-logo.png" alt="logo" className="w-24 mb-4" />
        <h2 className="text-xl sm:text-2xl font-bold mb-2 text-center text-[#29436e]">Reset Your Password</h2>
        <p className="text-xs sm:text-sm text-gray-600 mb-4 text-center">
          Enter your new password below to regain access to your account.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4a6d95] bg-white text-sm"
          />
          <Button
            type="submit"
            className="bg-[#0095F6] hover:bg-[#258bcf] text-white text-base font-semibold rounded-md py-2 transition"
          >
            Reset Password
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
