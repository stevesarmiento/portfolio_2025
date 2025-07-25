"use client";

import dynamic from "next/dynamic";
import { PlaygroundGridItem } from "./PlaygroundGridItem";

// Dynamic imports for demo components only
const FamilyActionButton = dynamic(() => import("@/components/playground/FamilyActionButton").then(mod => ({ default: mod.FamilyActionButton })), {
  ssr: false
});

const FamilyGasSelector = dynamic(() => import("@/components/playground/FamilyGasSelector").then(mod => ({ default: mod.FamilyGasSelector })), {
  ssr: false
});

const DrawerDemo = dynamic(() => import("@/components/playground/DrawerDemo").then(mod => ({ default: mod.DrawerDemo })), {
  ssr: false
});

const IosAppFolder = dynamic(() => import("@/components/playground/IosAppFolder").then(mod => ({ default: mod.IosAppFolder })), {
  ssr: false
});

const WalletCommander = dynamic(() => import("@/components/playground/WalletCommander").then(mod => ({ default: mod.WalletCommander })), {
  ssr: false
});

const WalletModal = dynamic(() => import("@/components/playground/WalletModal").then(mod => ({ default: mod.WalletModal })), {
  ssr: false
});

const FamilyWalletCreation = dynamic(() => import("@/components/playground/FamilyWalletCreation"), {
  ssr: false
});

export function PlaygroundContent() {
  const stripedBg = {
    backgroundImage: `repeating-linear-gradient(
      45deg,
      transparent,
      transparent 10px,
      rgba(255, 255, 255, 0.05) 10px,
      rgba(255, 255, 255, 0.05) 11px
    )`
  };

  const iosBg = {
    backgroundImage: `url('/img/ios-bkg.png')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundColor: 'rgba(46, 77, 97, 0.1)'
  };

  return (
    <>
      {/* Row 1 - Left */}
      <PlaygroundGridItem
        title="Family Wallet Creation"
        description="Wallet creation animation experiment"
        className="col-span-4 border-t border-[#252525] border-dashed"
        delay={0.2}
      >
        <FamilyWalletCreation />
      </PlaygroundGridItem>

      {/* Row 2 - Left */}
      <PlaygroundGridItem
        title="iOS App Folder"
        description="iOS folder animation replica"
        className="col-span-4"
        delay={0.25}
        backgroundStyle={iosBg}
      >
        <IosAppFolder />
      </PlaygroundGridItem>

      {/* Row 1 & 2 - Right */}
      <div className="grid grid-cols-1 divide-y divide-[#252525] divide-dashed col-span-4">
        <PlaygroundGridItem
          title="Wallet Info Modal"
          description="Transitional animations experiment"
          className="col-span-1"
          delay={0.3}
          backgroundStyle={stripedBg}
        >
          <WalletModal />
        </PlaygroundGridItem>

        <PlaygroundGridItem
          title="Wallet CMD + K"
          description="Natural language wallet interface"
          className="col-span-1"
          delay={0.35}
          backgroundStyle={stripedBg}
        >
          <WalletCommander />
        </PlaygroundGridItem>
      </div>

      {/* Row 3 - Left */}
      <PlaygroundGridItem
        title="Family TX Confirmation"
        description="Transaction simulator with gas selector"
        className="col-span-4"
        delay={0.4}
        backgroundStyle={stripedBg}
      >
        <FamilyGasSelector isDark={false} />
      </PlaygroundGridItem>

      {/* Row 3 - Right */}
      <PlaygroundGridItem
        title="Family Feedback Modal"
        description="Family feedback modal with drawer"
        className="col-span-4"
        delay={0.45}
        backgroundStyle={stripedBg}
      >
        <DrawerDemo />
      </PlaygroundGridItem>

      {/* Row 4 - Left */}
      <PlaygroundGridItem
        title="Family Action Button"
        description="Action button with state transitions"
        className="col-span-4"
        delay={0.5}
        backgroundStyle={stripedBg}
      >
        <FamilyActionButton />
      </PlaygroundGridItem>
    </>
  );
} 