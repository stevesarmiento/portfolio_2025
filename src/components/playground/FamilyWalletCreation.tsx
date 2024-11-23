import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FamilyWalletCard } from "./components/FamilyWalletCard";
import GridAnimation from "./components/GridAnimation";

export default function FamilyWalletCreation() {
    const [showGrid, setShowGrid] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
    const [isRevealing, setIsRevealing] = useState(false);

    const startAnimation = () => {
        setHasStarted(true);
        setShowGrid(true);
        setTimeout(() => {
            setIsRevealing(true);
        }, 4000);
        
        setTimeout(() => {
            setShowGrid(false);
            // setIsRevealing(false);
        }, 4000);
    };

    const resetAnimation = () => {
        setHasStarted(false);
        setShowGrid(false);
        setIsRevealing(false);
    };

    return (
        <div className="flex flex-col items-center justify-center w-full h-full rounded-3xl bg-white gap-6">
            {!hasStarted ? (
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="px-4 py-2 text-gray-400 hover:text-gray-500 font-medium rounded-full border border-transparent hover:border-gray-200 active:border-transparent transition-colors"
                    onClick={startAnimation}
                >
                    Create Wallet
                </motion.button>
            ) : (
                <AnimatePresence mode="wait">
                    <div className="relative">
                        {/* Wallet Card with mask */}
                        <motion.div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                            initial={{ opacity: 1 }}
                            style={{
                                clipPath: isRevealing 
                                    ? 'circle(150% at 50% 50%)' 
                                    : 'circle(0% at 50% 50%)',
                                transition: 'clip-path 0.5s ease-in-out'
                            }}
                        >
                            <FamilyWalletCard key={Date.now()} />
                        </motion.div>

                        {showGrid && (
                            <div className="flex flex-col items-center gap-4">
                                <motion.p
                                    initial={{ opacity: 0, y: 100 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="text-gray-500 text-xl font-medium"
                                >
                                    Creating your wallet
                                </motion.p>
                                
                                <motion.div
                                    key="grid"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <GridAnimation />
                                </motion.div>

                                <motion.p
                                    initial={{ opacity: 0, y: -100 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="text-gray-400 text-sm"
                                >
                                    Doing some cryptographic magic...
                                </motion.p>
                            </div>
                        )}

                        {!showGrid && (
                            <motion.div
                                key="wallet-container"
                                className="flex flex-col items-center gap-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <div className="relative">
                                    <motion.p
                                        initial={{ opacity: 0, x: 100 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="text-gray-500 text-xl font-medium relative z-10"
                                    >
                                        Your wallet is  
                                        <span
                                            className="ml-1"
                                            style={{
                                                background: "linear-gradient(to right, #CC4AB7, #6C67EE)",
                                                WebkitBackgroundClip: "text",
                                                WebkitTextFillColor: "transparent",
                                                backgroundClip: "text"
                                            }}
                                        >
                                            ready!
                                        </span>
                                    </motion.p>
                                    
                                    <motion.svg
                                        width="60"
                                        height="9"
                                        viewBox="0 0 60 8"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="absolute right-[2px]"
                                        initial={{ pathLength: 1, opacity: 1}}
                                    >
                                        <motion.path
                                            d="M 0 4 C 15 0, 45 0, 60 4"
                                            stroke="url(#gradient)"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            initial={{ pathLength: 1 }}
                                        />
                                        <defs>
                                            <linearGradient id="gradient" x1="0" y1="0" x2="200" y2="0">
                                                <stop offset="0%" stopColor="#6C67EE" />
                                                <stop offset="100%" stopColor="#6C67EE" />
                                            </linearGradient>
                                        </defs>
                                    </motion.svg>
                                </div>

                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-sm text-gray-500/50 hover:text-gray-700 transition-colors mt-[220px]"
                                    onClick={resetAnimation}
                                >
                                    Reset Animation
                                </motion.button>
                            </motion.div>
                        )}
                    </div>
                </AnimatePresence>
            )}
        </div>
    );
}