'use client';
import { useEffect } from "react";
import { TonConnectButton, useTonConnectUI, SendTransactionRequest } from '@tonconnect/ui-react';
import Image from 'next/image';
import useUserStore from '@/stores/useUserStore';
import ArrowRight from '@/icons/ArrowRight';
import Community from '@/icons/Community';
import Star from '@/icons/Star';
import { sun, sparkles } from '@/images';
import UserCollection from "./UserCollection";
import InfoBlock from '@/components/InfoBlock';

const HomeTab = () => {
  const user = useUserStore((state) => state.user);

  return (
    <div className={`home-tab-con transition-all duration-300`}>
      <div className="flex flex-col items-center mt-12">
        <Image src={sun} alt="Sun" width={108} height={108} />
        <div className="text-6xl font-bold mb-1">  {user.ecobalance} ECO</div>
        <div className="flex items-center gap-1 text-[#868686] rounded-full px-4 py-1.5 mt-2 cursor-pointer">
          <span>NEWCOMER</span>
          <Image src={sparkles} alt="Sparkles" width={18} height={18} />
          <span>RANK</span>
          <ArrowRight className="w-6 h-6" />
        </div>
      </div>
      
      <div className="space-y-3 px-4 mt-8 mb-8">
        <div className="flex gap-4 px-4">
          <button
            className="shine-effect flex-1 bg-[#ffffff0d] border-[1px] border-[#2d2d2e] rounded-lg px-4 py-2 flex items-center justify-between"
          >
            <div className="flex items-center gap-3 font-medium">
              <Community className="w-8 h-8" />
              <span>Buy ECO miner</span>
            </div>
            <ArrowRight className="w-6 h-6 text-gray-400" />
          </button>

          <button className="shine-effect flex-1 bg-[#ffffff0d] border-[1px] border-[#2d2d2e] rounded-lg px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-3 font-medium">
              <Star className="w-8 h-8" />
              <span>Check your rewards</span>
            </div>
            <ArrowRight className="w-6 h-6 text-gray-400" />
          </button>
          
        </div><div className="p-4">
      <InfoBlock 
        
        //activeBoosters={0} 
        progress={32} 
        //totalProfit={9.76} 
      />
    </div>
        <UserCollection />
       
      </div>
    </div>
  );
};
/// <pre>{JSON.stringify(user, null, 2)}</pre>
export default HomeTab;



