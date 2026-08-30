"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const FamilyWalletCreation = dynamic(
  () => import("@/components/playground/family-wallet-creation"),
  { ssr: false },
);

const FamilyActionButton = dynamic(
  () =>
    import("@/components/playground/family-action-button").then((module) => ({
      default: module.FamilyActionButton,
    })),
  { ssr: false },
);

const FamilyGasSelector = dynamic(
  () =>
    import("@/components/playground/family-gas-selector").then((module) => ({
      default: module.FamilyGasSelector,
    })),
  { ssr: false },
);

const DrawerDemo = dynamic(
  () =>
    import("@/components/playground/drawer-demo").then((module) => ({
      default: module.DrawerDemo,
    })),
  { ssr: false },
);

const stageBackground = {
  backgroundImage:
    "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(24, 24, 27, 0.045) 10px, rgba(24, 24, 27, 0.045) 11px)",
};

function FamilyStudyStage({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  return (
    <div
      className={cn(
        "isolate flex w-full items-center justify-center overflow-hidden rounded-[23px] bg-white/35 px-2 py-4 shadow-sm ring-1 ring-black/10 sm:px-4",
        className,
      )}
      style={stageBackground}
    >
      {children}
    </div>
  );
}

export function FamilyWalletCreationStudy() {
  return (
    <FamilyStudyStage className="h-[430px]">
      <div className="h-[360px] w-[320px] shrink-0 origin-center scale-[0.72] min-[360px]:scale-[0.95] min-[480px]:h-full min-[480px]:w-full min-[480px]:scale-100">
        <FamilyWalletCreation />
      </div>
    </FamilyStudyStage>
  );
}

export function FamilyActionMenuStudy() {
  return (
    <FamilyStudyStage className="min-h-[290px]">
      <div className="w-[300px] shrink-0 origin-center scale-[0.78] min-[360px]:scale-100">
        <FamilyActionButton />
      </div>
    </FamilyStudyStage>
  );
}

export function FamilyTransactionStudy() {
  return (
    <FamilyStudyStage className="min-h-[430px]">
      <div className="w-[390px] shrink-0 origin-center scale-[0.6] min-[360px]:scale-[0.78] min-[480px]:scale-100">
        <FamilyGasSelector isDark={false} />
      </div>
    </FamilyStudyStage>
  );
}

export function FamilyFeedbackStudy() {
  return (
    <FamilyStudyStage className="min-h-[180px]">
      <DrawerDemo />
    </FamilyStudyStage>
  );
}
