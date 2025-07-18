import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Label } from '@radix-ui/react-label'
import { Button } from './ui/button'
import axios from 'axios'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '@/redux/authSlice.js'

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const signInHandler = async (e) => {
        e.preventDefault();              //preventing to refress the page buz after refressing page data may lose
        try {
            setLoading(true);
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/user/login`, input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setAuthUser(res.data.user));
                navigate("/");
                toast.success(res.data.message);
                setInput({
                    email: "",
                    password: ""
                })
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
            if (error.response.data.message === "Incorrrect Password!") setInput({ password: "" });
            else setInput({
                email: "",
                password: ""
            })

        } finally {
            setLoading(false);

        }
    }

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [])

    return (
        <div className='flex items-center justify-center min-h-screen w-full bg-gradient-to-b from-white to-[#4a6d95] px-2'>
            <form onSubmit={signInHandler} className='shadow-2xl flex flex-col gap-5 p-6 sm:p-8 bg-gradient-to-b from-white to-[#8295ac] rounded-md w-full max-w-xs sm:max-w-sm md:max-w-sm'>
                <div className='my-2 mb-6'>
                    <div className="justify-center flex items-center mb-4">
                        <img src="/iintellex-logo.png" alt="logo" className="w-32 sm:w-40 md:w-48" />
                    </div>
                    <p className='text-sm text-center w-full max-w-xs mx-auto'>Log in to explore ideas, share insights, and connect with curious minds</p>
                </div>

                <div>
                    <Label className='font-medium'>Email</Label>
                    <Input
                        type='email'
                        name='email'
                        value={input.email}
                        onChange={changeEventHandler}
                        className="focus-visible:ring-transparent my-2"
                    />
                </div>
                <div>
                    <Label className='font-medium'>Password</Label>
                    <Input
                        type='password'
                        name='password'
                        value={input.password}
                        onChange={changeEventHandler}
                        className=" focus-visible:ring-transparent my-2 mb-8"
                    />
                </div>

                <div className="text-right text-sm -mt-2 mb-6">
                    <Link to="/forgot-password" className="text-blue-900 font-semibold hover:underline">
                        Forgot Password?
                    </Link>
                </div>

                {
                    loading ? (
                        <Button>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Please wait
                        </Button>
                    ) : (
                        <Button type='submit' className="cursor-pointer">Login</Button>
                    )
                }

                <span className='text-center text-xs sm:text-sm'>Don't have an account? <Link to="/signup" className='text-blue-900 font-semibold hover:underline'>Signup</Link></span>

            </form>
        </div>
    )
}

export default Login