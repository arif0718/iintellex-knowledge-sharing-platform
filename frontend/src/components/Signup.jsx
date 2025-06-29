import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Label } from "@radix-ui/react-label";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";

const Signup = () => {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);

  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const signupHandler = async (e) => {
    e.preventDefault(); //preventing to refress the page buz after refressing page data may lose
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/register",
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
        setInput({
          username: "",
          email: "",
          password: "",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gradient-to-b from-white to-[#4a6d95] px-2">
      <form
        onSubmit={signupHandler}
        className="shadow-2xl flex flex-col gap-5 p-6 sm:p-10 bg-gradient-to-b from-white to-[#8295ac] rounded-md w-full max-w-xs sm:max-w-sm md:max-w-md"
      >
        <div className="my-2 mb-6">
          <div className="justify-center flex items-center mb-4">
            <img src="/iintellex-logo.png" alt="logo" className="w-32 sm:w-40 md:w-48" />
          </div>
          <p className="text-sm text-center w-full max-w-xs mx-auto">
            Sign up to share knowledge, discover industry trends, and connect with future innovators
          </p>
        </div>
        <div>
          <Label className="font-medium">Username</Label>
          <Input
            type="text"
            name="username"
            value={input.username}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent my-2"
          />
        </div>
        <div>
          <Label className="font-medium">Email</Label>
          <Input
            type="email"
            name="email"
            value={input.email}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent my-2"
          />
        </div>
        <div>
          <Label className="font-medium">Password</Label>
          <Input
            type="password"
            name="password"
            value={input.password}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent my-2 mb-8"
          />
        </div>
        {/* code for showing loading logo in button */}
        {loading ? (
          <Button>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button type="submit" className="cursor-pointer">Signup</Button>
        )}
        <span className="text-center text-xs sm:text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-900 font-semibold hover:underline">
            Login
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Signup;
