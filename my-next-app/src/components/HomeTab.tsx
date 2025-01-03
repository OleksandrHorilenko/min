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
import Link from 'next/link';
import { useRouter } from 'next/router'
import { useState } from 'react';
import { useTab } from '@/contexts/TabContext'
import { TiAdjustBrightness, TiShoppingCart, TiClipboard } from "react-icons/ti";
import { IoPaperPlaneOutline } from "react-icons/io5";
import { WiStars } from "react-icons/wi";

const HomeTab = () => {
  const user = useUserStore((state) => state.user);
  //const router = useRouter();
  //const user = useUserStore((state) => state.user);
  const [currentTab, setCurrentTab] = useState('leaderboard');
  const { activeTab, setActiveTab } = useTab()

  

  return (
    <div className={`home-tab-con transition-all duration-300`}>
      <div className="flex flex-col items-center mt-12">
      <IoPaperPlaneOutline  size={108} color="1E90FF" />
        <div className="text-4xl font-bold mb-1">
  {user.ecobalance.toFixed(2)} THE
</div>
        
        <div className="flex items-center gap-1 text-[#868686] rounded-full px-4 py-1.5 mt-2 cursor-pointer">
          <span>NEWCOMER</span>
          <WiStars  size={24} color="1E90FF" />
          <span>RANK</span>
          <ArrowRight className="w-6 h-6" />
        </div>
      </div>
      
      <div className="space-y-3 px-4 mt-8 mb-8">
        <div className="flex gap-4 px-4">
          <button
            className="shine-effect flex-1 bg-[#ffffff0d] border-[1px] border-[#2d2d2e] rounded-lg px-4 py-2 flex items-center justify-between"
            key={'leaderboard'}
                                onClick={() => setActiveTab('leaderboard')}
          >
            <div className="flex items-center gap-3 font-medium">
            <TiShoppingCart size={36} color="#9400D3" />
              <span>Buy THE miner</span>
            </div>
            <ArrowRight className="w-6 h-6 text-gray-400" />
          </button>

          <button className="shine-effect flex-1 bg-[#ffffff0d] border-[1px] border-[#2d2d2e] rounded-lg px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-3 font-medium"
            key={'earn'}
            onClick={() => setActiveTab('earn')}
            >
              <TiClipboard size={36} color="#9400D3" />
              <span>Get tasks</span>
            </div>
            <ArrowRight className="w-6 h-6 text-gray-400" />
          </button>
          
        </div><div className="p-4">
      <InfoBlock 
        
        //activeBoosters={0} 
        //progress={32} 
        //totalProfit={9.76} 
      />
    </div>
     
       
      </div>
    </div>
  );
};
/// //  <UserCollection />
/// <pre>{JSON.stringify(user, null, 2)}</pre>
export default HomeTab;



