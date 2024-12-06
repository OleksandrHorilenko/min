'use client'

import { useTab } from '@/contexts/TabContext'
import { FaHome, FaTrophy, FaUsers, FaGift, FaWallet, FaStore } from 'react-icons/fa' // Импортируем иконки из react-icons/fa
import { TabType } from '@/utils/types'

const NavigationBar = () => {
    const { activeTab, setActiveTab } = useTab()

    const tabs: { id: TabType; label: string; Icon: React.FC<{ className?: string }> }[] = [
        { id: 'home', label: 'Home', Icon: FaHome }, // Используем FaHome для Home
        { id: 'leaderboard', label: 'Market', Icon: FaStore }, // Используем FaTrophy для Leaderboard
        { id: 'friends', label: 'Friends', Icon: FaUsers }, // Используем FaUsers для Friends
        { id: 'earn', label: 'Earn', Icon: FaGift }, // Используем FaGift для Earn
        { id: 'wallet', label: 'Wallet', Icon: FaWallet }, // Используем FaWallet для Wallet
    ]

    return (
        <div className="flex justify-center w-full">
            <div className="fixed bottom-0 bg-black border-t border-gray-800 w-full max-w-md">
                <div className="flex justify-between px-4 py-2">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex flex-col items-center`}
                            >
                                <tab.Icon
                                    className={`w-8 h-8 ${isActive ? 'text-[#4c9ce2]' : 'text-[#727272]'}`}
                                />
                                <span
                                    className={`text-xs font-medium ${isActive ? 'text-[#4c9ce2]' : 'text-[#727272]'}`}
                                >
                                    {tab.label}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default NavigationBar

