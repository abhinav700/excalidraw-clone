import { SIGN_IN_ROUTE } from '@/common/constants';
import { useRouter } from 'next/navigation';
import React from 'react'

const Logout = () => {
  const router = useRouter();
  
  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    try{
      localStorage.removeItem('token');
      router.push(SIGN_IN_ROUTE);
    } catch(err){
      console.log(err);
    }
  }
  return (
    <button
      onClick={handleLogout}
     className='px-1 py-2 rounded-md mt-[2.5%] absolute right-3 bg-red-600 hover:bg-red-500 cursor-pointer text-white font-semibold'>Logout</button>

  )
}

export default Logout