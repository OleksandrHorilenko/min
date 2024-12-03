

'use client'

import Wallet from '@/icons/Wallet'

import { TonConnectButton } from '@tonconnect/ui-react';
import PawsLogo from '@/icons/PawsLogo'
import Community from '@/icons/Community'
import Star from '@/icons/Star'
import Image from 'next/image'
import ArrowRight from '@/icons/ArrowRight'
import { sparkles } from '@/images'
import { sun }  from '@/images'

const HomeTab = () => {
    return (
        <div className={`home-tab-con transition-all duration-300`}>
            {/* Connect Wallet Button */}
            <div className="w-full flex justify-center mt-8">
      <TonConnectButton />
    </div>

            {/* PAWS Balance */}
            <div className="flex flex-col items-center mt-12">
            <Image
                        src={sun}
                        alt="sparkles"
                        width={108}
                        height={108}
                    />
               {/*  <PawsLogo className="w-28 h-28 mb-4" />*/}
                <div className="flex items-center gap-1 text-center">
                    <div className="text-6xl font-bold mb-1">4,646</div>
                    <div className="text-white text-6xl">   ECO</div>
                </div>
                <div className="flex items-center gap-1 text-[#868686] rounded-full px-4 py-1.5 mt-2 cursor-pointer">
                    <span>NEWCOMER</span>
                    <Image
                        src={sparkles}
                        alt="sparkles"
                        width={18}
                        height={18}
                    />
                    <span>RANK</span>
                    <ArrowRight className="w-6 h-6" />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 px-4 mt-8 mb-8">
            <div className="flex gap-4 px-4 mt-8 mb-8">
  <button className="shine-effect flex-1 bg-[#ffffff0d] border-[1px] border-[#2d2d2e] rounded-lg px-4 py-2 flex items-center justify-between">
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
</div>
                <div className="shine-effect w-full bg-[#ffffff0d] border-[1px] border-[#2d2d2e] rounded-lg px-4 py-2 grid grid-cols-3 gap-4">
  <div className="flex flex-col items-center justify-center bg-[#2d2d2e] text-white rounded-md p-2">
    <div className="text-sm font-medium">Title 1</div>
    <div className="text-xs text-[#ffffff80]">Description 1</div>
  </div>
  <div className="flex flex-col items-center justify-center bg-[#2d2d2e] text-white rounded-md p-2">
    <div className="text-sm font-medium">Title 2</div>
    <div className="text-xs text-[#ffffff80]">Description 2</div>
  </div>
  <div className="flex flex-col items-center justify-center bg-[#2d2d2e] text-white rounded-md p-2">
    <div className="text-sm font-medium">Title 3</div>
    <div className="text-xs text-[#ffffff80]">Description 3</div>
  </div>
  <div className="flex flex-col items-center justify-center bg-[#2d2d2e] text-white rounded-md p-2">
    <div className="text-sm font-medium">Title 4</div>
    <div className="text-xs text-[#ffffff80]">Description 4</div>
  </div>
  <div className="flex flex-col items-center justify-center bg-[#2d2d2e] text-white rounded-md p-2">
    <div className="text-sm font-medium">Title 5</div>
    <div className="text-xs text-[#ffffff80]">Description 5</div>
  </div>
  <div className="flex flex-col items-center justify-center bg-[#2d2d2e] text-white rounded-md p-2">
    <div className="text-sm font-medium">Title 6</div>
    <div className="text-xs text-[#ffffff80]">Description 6</div>
  </div>
  <div className="flex flex-col items-center justify-center bg-[#2d2d2e] text-white rounded-md p-2">
    <div className="text-sm font-medium">Title 7</div>
    <div className="text-xs text-[#ffffff80]">Description 7</div>
  </div>
  <div className="flex flex-col items-center justify-center bg-[#2d2d2e] text-white rounded-md p-2">
    <div className="text-sm font-medium">Title 8</div>
    <div className="text-xs text-[#ffffff80]">Description 8</div>
  </div>
  <div className="flex flex-col items-center justify-center bg-[#2d2d2e] text-white rounded-md p-2">
    <div className="text-sm font-medium">Title 9</div>
    <div className="text-xs text-[#ffffff80]">Description 9</div>
  </div>
</div>
            </div>
        </div>
    )
}

export default HomeTab