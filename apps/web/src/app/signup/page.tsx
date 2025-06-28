"use client"
import { SignUpUser } from "@/common/types/types";
import { HTTP_BACKEND_URL } from "@/config";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Signup = () => {
  const [user, setUser] = useState<SignUpUser>({
    name: "",
    email: "",
    password: "",
    confirmPassword:"",
  })
  const [showPasswordWarning, setShowPasswordWarning] = useState<boolean>(false);
  const router = useRouter();

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    try{
       let name:string = e.target.name;
       setUser({...user, [name]: e.target.value})
       
       if(name == 'confirmPassword'){
          if(e.target.value == user.password)
            setShowPasswordWarning(false);
          else
            setShowPasswordWarning(p => true);
       }
       
    }catch(err){
      console.log(err);
    }
  }
  
  const inputClassName="bg-gray-400 text-black rounded-md p-[5px] outline-none w-full"
  
  const  onSubmitHandler = async (e: any) => {
    try{
      e.preventDefault();

      const requestBody = {...user};
      const requestOptions = {withCredentials: true};

      const response = await axios.post(`${HTTP_BACKEND_URL}/user/signin`, requestBody,requestOptions);

      if(response.status == 200){
        router.push('/join-room')
      }
      
    } catch(err){
      console.log(err);
    }
  }
  return (
    <div className="w-full flex flex-col h-[100vh] justify-center items-center">
        <div className="bg-slate-900 max-h-[500px] w-[350px] p-2 rounded-md text-white">
          <h1 className="text-center text-[30px] font-bold">Sign up</h1>
          <div className="mt-[10%]">
            <label htmlFor="name">Name: </label>
            <br/>
            <input required value={user.name} type='text' name='name' onChange={onChangeHandler} className={inputClassName}/>
          </div>  

          <div className="mt-[10%]">
            <label htmlFor="email">Email: </label>
            <br/>
            <input required value={user.email} type='email' name='email' onChange={onChangeHandler} className={inputClassName}/>
          </div>
          
          <div className="mt-5">
            <label htmlFor="password">Password: </label>
            <br/>
            <input required value={user.password} type='password' name='password' onChange={onChangeHandler} className={inputClassName}/>
          </div>
          
          <div className="mt-5">
            <label htmlFor="confirmPassword">Confirm Password: </label>
            <br/>
            <input required value={user.confirmPassword} type='password' name='confirmPassword' onChange={onChangeHandler} className={inputClassName}/>
           {showPasswordWarning && <p className="text-red-700 mt-3" >Passwords do not match.</p>}
          </div>

          <button onClick={async (e) => {await onSubmitHandler(e)}} className="text-center bg-gray-300 text-md rounded-md cursor-pointer hover:bg-gray-500 p-1 text-black mt-6 ml-[39%]">Submit</button>
          <p className="text-center mt-5">
            Already have an account? <Link className="text-blue-300 hover:underline" href={'/'}>Sign In</Link>
          </p>  
        </div>
      </div>
  )
}

export default Signup;