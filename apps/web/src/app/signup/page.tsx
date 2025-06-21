import Link from "next/link";

const Signup = () => {

  const inputClassName="bg-gray-400 text-black rounded-md p-[5px] outline-none"

  return (
    <div className="w-full flex flex-col h-[100vh] justify-center items-center">
        <div className="bg-slate-900 max-h-[400px] max-w-[350px] p-2 rounded-md text-white">
          <h1 className="text-center text-[30px] font-bold">Sign up</h1>
          <div className="mt-[10%]">
            <label htmlFor="email">Email: </label>
            <br/>
            <input type='email' name='email' className={inputClassName}/>
          </div>
          <div className="mt-5">
            <label htmlFor="password">Password: </label>
            <br/>
            <input type='password' name='password' className={inputClassName}/>
          </div>
          <button className="text-center bg-gray-300 text-md rounded-md cursor-pointer hover:bg-gray-500 p-1 text-black mt-6 ml-[39%]">Submit</button>
          <p className="text-center mt-5">
            Already have an account? <Link className="text-blue-300 hover:underline" href={'/'}>Sign In</Link>
          </p>  
        </div>
      </div>
  )
}

export default Signup;