"use client"
type AuthPageProps = {
  isSignin: boolean;
}
const AuthPage = ({isSignin}: AuthPageProps) => {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="p-2 m-2 text-black flex flex-col items-center bg-white rounded-lg">
        <input className="my-1" type="text" placeholder="email"/>
        <input className="my-1" type="password" placeholder="password"/>
        <button>{isSignin ? "Sign In" : "Sign up"}</button>
      </div>

    </div>
  )
}

export default AuthPage