'use client'
import { useState, useEffect } from 'react';
import ArrowBigRight from "@/icons/ArrowBigRight"

const CheckFootprint = () => {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const data = localStorage.getItem('userData');
      if (data) {
        setUserData(JSON.parse(data));
      }
    }
  }, []);

  return (
    <div className="flex justify-center w-full">
  <div className="fixed top-0 w-full max-w-md px-4 py-3 bg-[#151516] cursor-pointer">
    <div className="flex justify-between items-center pl-2 border-l-[2px] border-[#4c9ce2]">
      <div className="flex items-center gap-4 text-base text-white font-medium">
        <span>Check your wallet</span>
        {userData && userData.id && (
          <span className="text-white">User ID: {userData.id}</span>
        )}
      </div>
      <button className="bg-[#4c9ce2] rounded-full px-2 py-1">
        <ArrowBigRight className="w-5 h-5" />
      </button>
    </div>
  </div>
</div>
  
  )
}

export default CheckFootprint
