import { motion } from "framer-motion";
import { FC } from "react";
import { IconGamecontrollerFill, IconSquareOnSquare } from "symbols-react";

interface FamilyWalletCardProps {
    bgColor?: string;
    IconComponent?: React.ReactNode;
    walletName?: string;
    ethValue?: string;
    onClick?: () => void;
    uniqueId?: string;
}

export const FamilyWalletCard: FC<FamilyWalletCardProps> = ({
    bgColor = "cyan-500",
    IconComponent = IconSquareOnSquare,
    walletName = "GG Wallet",
    ethValue = "1337 SOL",
    onClick = () => {},
    uniqueId = "1",
  }) => {
    return (
        <motion.div
            key={uniqueId}
            initial={{ scale: 0.7 }}
            animate={{ scale: 1 }}
            layoutId={`wallet-${uniqueId}`}
            transition={{
                scale: {
                    type: "spring",
                    stiffness: 200, 
                    damping: 12,     
                    mass: 1,         
                    velocity: 2       
                }
            }}
            className="flex cursor-pointer flex-col items-start justify-between p-5 bg-cyan-500"
            style={{
            height: "200px",
            width: "320px",
            borderRadius: 24,
            backgroundColor: bgColor,
            }}
        >
        <motion.div className="flex w-full items-start justify-between">
          <motion.div
            layoutId={`icon-${uniqueId}`}
            className="flex items-center justify-center bg-white/10 rounded-full p-2"
            onClick={onClick}
          >
             <IconGamecontrollerFill className="h-10 w-10 translate-x-0 translate-y-0 fill-white" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
            className="flex h-[24px] shrink-0 translate-x-0 translate-y-0 cursor-pointer select-none items-center justify-center gap-x-[6px] font-semibold text-white"
            whileTap={{ scale: 0.9 }}
          >
            MNG0g...69420
            <motion.div className="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center">
              {IconComponent && <IconComponent className="h-4 w-4 shrink-0 translate-x-0 translate-y-0 fill-white/50" />}
            </motion.div>
          </motion.div>
        </motion.div>
        <div className="flex w-full items-end justify-between">
          <div className="flex flex-col items-start justify-center">
            <motion.span
              layoutId={`walletName-${uniqueId}`}
              className="select-none text-xl font-semibold text-white"
            >
              {walletName}
            </motion.span>
            <motion.span
              layoutId={`ethValue-${uniqueId}`}
              className="select-none text-lg font-semibold text-white/50"
            >
              {ethValue}
            </motion.span>
          </div>
          <motion.button
            initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
            className=" flex h-[32px] text-md select-none items-center justify-center rounded-full bg-white p-2 px-3 font-semibold text-cyan-500 transition-colors duration-150 ease-out"
          >
            Back Up Now
          </motion.button>
        </div>
      </motion.div>
    );
  };