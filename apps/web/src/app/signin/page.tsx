"use client";
import { SignInUser } from "@/common/types/types";
import { HTTP_BACKEND_URL } from "@/config";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Signin = () => {
  const inputClassName="bg-gray-400 text-black rounded-md p-[5px] outline-none"
  const [user, setUser] = useState<SignInUser>({
    email: "",
    password: "",
  })

  const router = useRouter()

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    try{
      const name = e.target.name;
      setUser(u => ({...user, [name]: e.target.value}))
      return;
    } catch(err){
      console.log(err);
    }
  }

  const onSubmitHandler = async (e: React.MouseEvent<HTMLButtonElement>)=>{
    try{
      e.preventDefault();
      if(user.password.trim() == ''){
        return;
      }

      const response = await axios.post(`${HTTP_BACKEND_URL}/user/signin`, {
        ...user
      })

      const token: any = await response.data;

      if(!token)
        return;

      localStorage.setItem('token', token);
      router.push('/join-room')
    
    }catch(err){
      console.log(err);
    }
  }
  return (
    <div className="w-full flex flex-col h-[100vh] justify-center items-center">
        <form action="post" className="bg-slate-900 max-h-[400px] max-w-[350px] p-2 rounded-md text-white">
          <h1 className="text-center text-[30px] font-bold">Sign in</h1>
          <div className="mt-[10%]">
            <label htmlFor="email">Email: </label>
            <br/>
            <input onChange={onChangeHandler} required type='email' name='email' className={inputClassName}/>
          </div>
          <div className="mt-5">
            <label htmlFor="password">Password: </label>
            <br/>
            <input onChange={onChangeHandler} required type='password' name='password' className={inputClassName}/>
          </div>
          <button onClick={async (e) => {await onSubmitHandler(e)}} className="text-center bg-gray-300 text-md rounded-md cursor-pointer hover:bg-gray-500 p-1 text-black mt-6 ml-[35%]">Submit</button>
            <p className="text-center mt-5">
            Don't have an account? <Link className="text-blue-300 hover:underline" href={'/signup'}>Sign Up</Link>
          </p>
        </form>
      </div>
  ) 
}

export default Signin;