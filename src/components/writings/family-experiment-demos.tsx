"use client";

import dynamic from "next/dynamic";
import { useState, type ReactElement, type ReactNode } from "react";

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

const DrawerDemo = dynamic<{ trigger?: ReactElement }>(
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
        "isolate flex w-full items-center justify-center overflow-hidden rounded-[23px] bg-white px-2 py-4 sm:px-4",
        className,
      )}
      style={stageBackground}
    >
      {children}
    </div>
  );
}

function FamilyPhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="absolute bottom-12 left-1/2 h-[720px] w-[350px] max-w-[calc(100%-12px)] -translate-x-1/2 rounded-[58px] bg-zinc-950 p-[7px] shadow-[0_24px_70px_rgba(255,255,255,0),inset_0_0_0_1px_rgba(255,255,255,0.12)] ring-1 ring-black/30">
      <div className="relative h-full overflow-hidden rounded-[51px] bg-white shadow-[inset_0_0_0_1px_rgba(24,24,27,0.08)]">
        {children}
      </div>
    </div>
  );
}

export function FamilyWalletCreationStudy() {
  return (
    <FamilyStudyStage className="h-[380px]">
      <div className="h-[360px] w-[320px] shrink-0 origin-center scale-[0.72] min-[360px]:scale-[0.95] min-[480px]:h-full min-[480px]:w-full min-[480px]:scale-100">
        <FamilyWalletCreation />
      </div>
    </FamilyStudyStage>
  );
}

function ExploreToolbar({ visible }: { visible: boolean }) {
  const controlClass =
    "flex size-9 cursor-pointer items-center justify-center rounded-full transition-[scale,background-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.95] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400 motion-reduce:active:scale-100";

  return (
    <div
      aria-hidden={!visible}
      inert={!visible}
      className={cn(
        "absolute inset-x-0 bottom-[77px] z-[5] h-12 max-h-12 border-t border-gray-100 bg-white transition-[opacity,translate] ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:translate-y-0 motion-reduce:transition-opacity px-4",
        visible
          ? "translate-y-0 opacity-100 delay-100 duration-75"
          : "pointer-events-none translate-y-2 opacity-0 delay-0 duration-75",
      )}
    >
      <div
        role="toolbar"
        aria-label="Explore controls"
        className="relative h-full"
      >
        <div className="absolute left-4 top-1/2 flex -translate-y-1/2">
          <button type="button" aria-label="Back" className={controlClass}>
          <svg
            aria-hidden="true"
            width="24"
            height="24"
            viewBox="0 0 30 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18.5 6L9.5 15L18.5 24"
              stroke="#E4E4E7"
              strokeWidth="3.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          </button>
          <button type="button" aria-label="Forward" className={controlClass}>
          <svg
            aria-hidden="true"
            width="24"
            height="24"
            viewBox="0 0 30 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.5 6L20.5 15L11.5 24"
              stroke="#E4E4E7"
              strokeWidth="3.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          </button>
        </div>
        <button
          type="button"
          aria-label="Search"
          aria-pressed="true"
          className={cn(
            controlClass,
            "absolute left-1/2 top-1/2 size-10 -translate-x-1/2 -translate-y-1/2 bg-zinc-100",
          )}
        >
          <svg
            aria-hidden="true"
            width="28"
            height="28"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M7.99992 15.2223C7.99992 11.2335 11.2334 8.00004 15.2222 8.00004C19.2109 8.00004 22.4443 11.2335 22.4443 15.2223C22.4443 19.211 19.2109 22.4444 15.2222 22.4444C11.2334 22.4444 7.99992 19.211 7.99992 15.2223ZM15.2222 5.33337C9.76065 5.33337 5.33325 9.76077 5.33325 15.2223C5.33325 20.6838 9.76065 25.1111 15.2222 25.1111C17.4722 25.1111 19.5466 24.3598 21.2083 23.094L24.3905 26.2762C24.9111 26.7968 25.7554 26.7968 26.2761 26.2762C26.7967 25.7555 26.7967 24.9112 26.2761 24.3906L23.0939 21.2084C24.3597 19.5467 25.111 17.4723 25.111 15.2223C25.111 9.76077 20.6837 5.33337 15.2222 5.33337Z"
              fill="black"
            />
          </svg>
        </button>
        <div className="absolute right-4 top-1/2 flex -translate-y-1/2">
          <button type="button" aria-label="Tabs, 1 open" className={controlClass}>
          <svg
            aria-hidden="true"
            width="24"
            height="24"
            viewBox="0 0 30 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="5.25"
              y="5.25"
              width="19.5"
              height="19.5"
              rx="4"
              stroke="#A1A1AA"
              strokeWidth="2.5"
            />
            <path
              d="M12.25 12.25L15.5 10.25V20.5"
              stroke="#A1A1AA"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          </button>
          <button type="button" aria-label="More" className={controlClass}>
          <svg
            aria-hidden="true"
            width="24"
            height="24"
            viewBox="0 0 30 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="8" cy="15" r="2" fill="#E4E4E7" />
            <circle cx="15" cy="15" r="2" fill="#E4E4E7" />
            <circle cx="22" cy="15" r="2" fill="#E4E4E7" />
          </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export function FamilyActionMenuStudy() {
  const [activeSection, setActiveSection] = useState<
    "activity" | "wallet" | "explore"
  >("wallet");
  const [actionMenuVersion, setActionMenuVersion] = useState(0);
  const actionsAreVisible = activeSection === "wallet";

  return (
    <FamilyStudyStage className="relative h-[400px]">
      <FamilyPhoneFrame>
          <ExploreToolbar visible={activeSection === "explore"} />
          <nav
            aria-label="Wallet sections"
            className="absolute inset-x-0 bottom-0 h-[77px] border-t border-gray-100 bg-white"
          >
            <div className="grid h-full w-full grid-cols-3 items-center px-10 text-zinc-400">
              <button
                type="button"
                aria-label="Activity"
                aria-pressed={activeSection === "activity"}
                className={cn(
                  "flex h-full cursor-pointer items-center justify-center rounded-xl transition-[opacity,scale] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.95] focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-zinc-400 motion-reduce:active:scale-100",
                  activeSection === "activity" ? "opacity-100" : "opacity-30",
                )}
                onClick={() => setActiveSection("activity")}
              >
                <svg
                  aria-hidden="true"
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {activeSection === "activity" ? (
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M16 28C22.6274 28 28 22.6274 28 16C28 9.37258 22.6274 4 16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28ZM17.3333 9C17.3333 8.26362 16.7364 7.66667 16 7.66667C15.2636 7.66667 14.6667 8.26362 14.6667 9V16.0007C14.6667 16.3543 14.8071 16.6934 15.0572 16.9435L17.7239 19.6101C18.2446 20.1308 19.0888 20.1308 19.6095 19.6101C20.1302 19.0894 20.1302 18.2452 19.6095 17.7245L17.3333 15.4484V9Z"
                      fill="black"
                    />
                  ) : (
                    <>
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M16 27C22.0751 27 27 22.0751 27 16C27 9.92487 22.0751 5 16 5C9.92487 5 5 9.92487 5 16C5 22.0751 9.92487 27 16 27Z"
                        stroke="black"
                        strokeWidth="2.5"
                      />
                      <path
                        d="M16 8.36121C16.6751 8.36121 17.2222 8.90841 17.2222 9.58343V15.4945L19.3087 17.5809C19.786 18.0582 19.786 18.832 19.3087 19.3094C18.8314 19.7867 18.0576 19.7867 17.5803 19.3094L15.1358 16.865C14.9065 16.6357 14.7778 16.3249 14.7778 16.0007V9.58343C14.7778 8.90841 15.325 8.36121 16 8.36121Z"
                        fill="black"
                      />
                    </>
                  )}
                </svg>
              </button>
              <button
                type="button"
                aria-label="Wallet"
                aria-pressed={activeSection === "wallet"}
                className={cn(
                  "flex h-full cursor-pointer items-center justify-center rounded-xl transition-[opacity,scale] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.95] focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-zinc-400 motion-reduce:active:scale-100",
                  activeSection === "wallet" ? "opacity-100" : "opacity-30",
                )}
                onClick={() => {
                  if (!actionsAreVisible) {
                    setActionMenuVersion((version) => version + 1);
                  }
                  setActiveSection("wallet");
                }}
              >
                <svg
                  aria-hidden="true"
                  width="33"
                  height="33"
                  viewBox="0 0 33 33"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {activeSection === "wallet" ? (
                    <path
                      d="M16.5 6.1875C17.8921 6.1875 19.5183 6.25117 21.1094 6.33984C23.513 6.47389 24.7162 6.54145 25.7959 7.12305C26.6775 7.59746 27.5619 8.48544 28.0342 9.36914C28.6127 10.4498 28.6751 11.6149 28.7979 13.9473C28.8453 14.8403 28.875 15.7152 28.875 16.5C28.875 17.2837 28.8453 18.1596 28.7979 19.0537C28.6751 21.3841 28.6126 22.5501 28.0342 23.6318C27.5619 24.5145 26.6775 25.4015 25.7959 25.877C24.7162 26.4586 23.5132 26.5271 21.1094 26.6611C19.5183 26.7488 17.8921 26.8125 16.5 26.8125C15.1079 26.8125 13.4817 26.7488 11.8906 26.6602C9.48705 26.5261 8.28376 26.4585 7.2041 25.877C6.32247 25.4025 5.43809 24.5146 4.96582 23.6309C4.38734 22.5502 4.32485 21.3851 4.20215 19.0527C4.15442 18.2028 4.12883 17.3513 4.125 16.5C4.125 15.7163 4.15471 14.8404 4.20215 13.9463C4.32485 11.6159 4.38736 10.4499 4.96582 9.36816C5.43809 8.4855 6.32246 7.59849 7.2041 7.12305C8.28382 6.54142 9.48678 6.47293 11.8906 6.33887C13.4255 6.24744 14.9625 6.19711 16.5 6.1875ZM10 10.75C9.30964 10.75 8.75 11.3096 8.75 12C8.75 12.6904 9.30964 13.25 10 13.25H17C17.6904 13.25 18.25 12.6904 18.25 12C18.25 11.3096 17.6904 10.75 17 10.75H10Z"
                      fill="black"
                    />
                  ) : (
                    <>
                      <path
                        d="M4.96547 9.36787C4.38694 10.4497 4.32506 11.616 4.20234 13.9466C4.15491 14.8407 4.125 15.7163 4.125 16.5C4.12883 17.3513 4.15462 18.2024 4.20234 19.0523C4.32506 21.385 4.38694 22.5503 4.96547 23.6311C5.43778 24.5149 6.32259 25.4028 7.20431 25.8772C8.28397 26.4587 9.48633 26.5258 11.8899 26.6599L11.8903 26.6599C13.4815 26.7486 15.1078 26.8125 16.5 26.8125C17.8922 26.8125 19.5185 26.7486 21.1097 26.6609C23.5135 26.5268 24.716 26.4588 25.7957 25.8772C26.6774 25.4018 27.5622 24.5149 28.0345 23.6321C28.6131 22.5503 28.6749 21.384 28.7977 19.0534C28.8451 18.1593 28.875 17.2837 28.875 16.5C28.875 15.7152 28.8451 14.8407 28.7977 13.9477C28.6749 11.615 28.6131 10.4497 28.0345 9.36891C27.5622 8.48513 26.6774 7.59722 25.7957 7.12284C24.716 6.54125 23.5137 6.47419 21.1101 6.34015L21.1097 6.34012C19.5185 6.25144 17.8922 6.1875 16.5 6.1875C14.9624 6.19711 13.4253 6.24766 11.8903 6.33909C9.48647 6.47316 8.28403 6.54122 7.20431 7.12284C6.32259 7.59825 5.43778 8.48512 4.96547 9.36787Z"
                        stroke="black"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10 12H17"
                        stroke="black"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </>
                  )}
                </svg>
              </button>
              <button
                type="button"
                aria-label="Explore"
                aria-pressed={activeSection === "explore"}
                className={cn(
                  "flex h-full cursor-pointer items-center justify-center rounded-xl transition-[opacity,scale] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.95] focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-zinc-400 motion-reduce:active:scale-100",
                  activeSection === "explore" ? "opacity-100" : "opacity-30",
                )}
                onClick={() => setActiveSection("explore")}
              >
                <svg
                  aria-hidden="true"
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {activeSection === "explore" ? (
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M4 16C4 9.37258 9.37258 4 16 4C22.6274 4 28 9.37258 28 16C28 22.6274 22.6274 28 16 28C9.37258 28 4 22.6274 4 16ZM20.6172 10.3882C21.3658 10.146 22.0738 10.854 21.8316 11.6026L20.2121 16.6082C19.9903 17.2939 19.1222 17.5028 18.6126 16.9933L15.2265 13.6072C14.717 13.0976 14.9259 12.2296 15.6116 12.0077L20.6172 10.3882ZM10.3882 20.6161C10.146 21.3648 10.854 22.0727 11.6026 21.8305L16.6082 20.211C17.2939 19.9892 17.5028 19.1211 16.9933 18.6116L13.6072 15.2255C13.0976 14.7159 12.2296 14.9249 12.0077 15.6105L10.3882 20.6161Z"
                      fill="black"
                    />
                  ) : (
                    <>
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M5 16C5 9.92487 9.92487 5 16 5C22.0751 5 27 9.92487 27 16C27 22.0751 22.0751 27 16 27C9.92487 27 5 22.0751 5 16Z"
                        stroke="black"
                        strokeWidth="2.5"
                      />
                      <path
                        d="M21.3457 11.9691C21.5677 11.2829 20.9187 10.6339 20.2325 10.8559L15.644 12.3404C15.0154 12.5438 14.8239 13.3395 15.291 13.8066L16.8429 15.3586L18.3949 16.9105C18.862 17.3776 19.6578 17.1861 19.8611 16.5575L21.3457 11.9691Z"
                        fill="black"
                      />
                      <path
                        d="M11.9691 21.3446C11.2829 21.5667 10.6339 20.9178 10.8559 20.2314L12.3404 15.643C12.5438 15.0145 13.3395 14.8229 13.8066 15.2901L16.9105 18.394C17.3776 18.861 17.1861 19.6568 16.5575 19.8601L11.9691 21.3446Z"
                        fill="black"
                      />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </nav>
          <div className="absolute right-[18px] bottom-[100px] z-10 w-[300px] origin-bottom-right scale-[0.64] min-[360px]:scale-[0.8] min-[400px]:scale-[0.9] min-[480px]:scale-100">
            <div className="flex w-full justify-end">
              <div
                aria-hidden={!actionsAreVisible}
                inert={!actionsAreVisible}
                className={cn(
                  "w-fit origin-center transition-[scale,opacity] ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:scale-100 motion-reduce:transition-opacity motion-reduce:duration-200",
                  actionsAreVisible
                    ? "scale-100 opacity-100 duration-200"
                    : "pointer-events-none scale-0 opacity-100 duration-300 motion-reduce:opacity-0",
                )}
              >
                <FamilyActionButton
                  key={actionMenuVersion}
                  align="right"
                />
              </div>
            </div>
          </div>
      </FamilyPhoneFrame>
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
    <FamilyStudyStage className="relative h-[440px]">
      <FamilyPhoneFrame>
        <div className="absolute inset-x-0 bottom-6">
          <div className="divide-y divide-zinc-100">
            <div
              aria-hidden="true"
              className="flex h-[60px] items-center gap-3 px-6"
            >
              <svg
                width="27"
                height="27"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0"
              >
                <path
                  d="M17.65 3.75L6.75 18.05H14.1L13.2 28.25L25.25 13.65H17.55L17.65 3.75Z"
                  stroke="#A1A1AA"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="flex-1 text-[16px] font-semibold tracking-[-0.025em] text-zinc-950">
                Refuel Wallet
              </span>
              <svg
                width="16"
                height="20"
                viewBox="0 0 18 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="9" cy="5" r="1.75" fill="#C4C4C7" />
                <circle cx="9" cy="12" r="1.75" fill="#C4C4C7" />
                <circle cx="9" cy="19" r="1.75" fill="#C4C4C7" />
              </svg>
            </div>

            <div
              aria-hidden="true"
              className="flex h-[60px] items-center gap-3 px-6"
            >
              <svg
                width="27"
                height="27"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0"
              >
                <path
                  d="M16 4.25C18.05 4.25 19.3 6.15 18.75 8.05C20.12 6.58 22.37 6.65 23.82 8.1C25.27 9.55 25.34 11.8 23.87 13.17C25.77 12.62 27.67 13.87 27.67 15.92C27.67 17.97 25.77 19.22 23.87 18.67C25.34 20.04 25.27 22.29 23.82 23.74C22.37 25.19 20.12 25.26 18.75 23.79C19.3 25.69 18.05 27.59 16 27.59C13.95 27.59 12.7 25.69 13.25 23.79C11.88 25.26 9.63 25.19 8.18 23.74C6.73 22.29 6.66 20.04 8.13 18.67C6.23 19.22 4.33 17.97 4.33 15.92C4.33 13.87 6.23 12.62 8.13 13.17C6.66 11.8 6.73 9.55 8.18 8.1C9.63 6.65 11.88 6.58 13.25 8.05C12.7 6.15 13.95 4.25 16 4.25Z"
                  stroke="#A1A1AA"
                  strokeWidth="2.25"
                  strokeLinejoin="round"
                />
                <circle
                  cx="16"
                  cy="16"
                  r="4"
                  stroke="#A1A1AA"
                  strokeWidth="2.25"
                />
              </svg>
              <span className="flex-1 text-[16px] font-semibold tracking-[-0.025em] text-zinc-950">
                App Icon
              </span>
              <svg
                width="16"
                height="20"
                viewBox="0 0 18 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="9" cy="5" r="1.75" fill="#C4C4C7" />
                <circle cx="9" cy="12" r="1.75" fill="#C4C4C7" />
                <circle cx="9" cy="19" r="1.75" fill="#C4C4C7" />
              </svg>
            </div>
          </div>

          <p className="mb-1.5 mt-5 px-6 text-[11px] font-semibold tracking-[0.04em] text-zinc-300">
            MORE OPTIONS
          </p>
          <div className="divide-y divide-zinc-100">
            <div
              aria-hidden="true"
              className="flex h-[60px] items-center gap-3 px-6"
            >
              <svg
                width="27"
                height="27"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0"
              >
                <path
                  d="M9.25 24.5H23.4C27.05 24.5 29.5 22.32 29.5 19.1C29.5 16.14 27.37 14.08 24.28 13.75C23.24 9.95 20.03 7.5 16.12 7.5C11.77 7.5 8.38 10.52 7.8 14.73C4.78 15.22 2.5 17.38 2.5 20.12C2.5 22.73 4.6 24.5 9.25 24.5Z"
                  stroke="#A1A1AA"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="flex-1 text-[16px] font-semibold tracking-[-0.025em] text-zinc-950">
                iCloud Backups
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.75 3.75L12 9L6.75 14.25"
                  stroke="#C4C4C7"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <DrawerDemo
              trigger={
                <button
                  type="button"
                  className="flex h-[60px] w-full cursor-pointer items-center gap-3 px-6 text-left transition-[background-color,scale] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-zinc-50 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-zinc-400 motion-reduce:active:scale-100"
                >
                  <svg
                    aria-hidden="true"
                    width="27"
                    height="27"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="shrink-0"
                  >
                    <circle
                      cx="16"
                      cy="16"
                      r="12"
                      stroke="#A1A1AA"
                      strokeWidth="2.4"
                    />
                    <circle
                      cx="16"
                      cy="16"
                      r="4.25"
                      stroke="#A1A1AA"
                      strokeWidth="2.4"
                    />
                    <path
                      d="M7.5 7.5L12.9 12.9M19.1 19.1L24.5 24.5M24.5 7.5L19.1 12.9M12.9 19.1L7.5 24.5"
                      stroke="#A1A1AA"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="flex-1 text-[16px] font-semibold tracking-[-0.025em] text-zinc-950">
                    Help &amp; Support
                  </span>
                  <svg
                    aria-hidden="true"
                    width="16"
                    height="20"
                    viewBox="0 0 18 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="9" cy="5" r="1.75" fill="#C4C4C7" />
                    <circle cx="9" cy="12" r="1.75" fill="#C4C4C7" />
                    <circle cx="9" cy="19" r="1.75" fill="#C4C4C7" />
                  </svg>
                </button>
              }
            />

            <div
              aria-hidden="true"
              className="flex h-[60px] items-center gap-3 px-6"
            >
              <svg
                width="27"
                height="27"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M21.0192 12.7156C21.2438 12.286 21.2438 11.7764 21.0192 11.3469C20.5727 10.4933 19.7923 9.0186 19.1875 7.96875C18.5559 6.8725 17.6276 5.39184 17.0978 4.55619C16.8407 4.15055 16.4048 3.89607 15.9251 3.87241C14.9509 3.82437 13.2422 3.75 11.9999 3.75C10.7578 3.75 9.04906 3.82437 8.07489 3.87241C7.59519 3.89606 7.15918 4.15055 6.90207 4.55619C6.3724 5.39184 5.44401 6.8725 4.81246 7.96875C4.20767 9.0186 3.42721 10.4933 2.98075 11.3469C2.75609 11.7764 2.75609 12.286 2.98075 12.7156C3.42721 13.5692 4.20767 15.0439 4.81246 16.0937C5.44401 17.19 6.3724 18.6706 6.90207 19.5063C7.15918 19.912 7.59519 20.1664 8.07489 20.1901C9.04906 20.2381 10.7578 20.3125 11.9999 20.3125C13.2422 20.3125 14.9509 20.2381 15.9251 20.1901C16.4048 20.1664 16.8407 19.912 17.0978 19.5063C17.6276 18.6706 18.5559 17.19 19.1875 16.0937C19.7923 15.0439 20.5727 13.5692 21.0192 12.7156ZM12.0005 15.1562C13.7264 15.1562 15.1255 13.7572 15.1255 12.0313C15.1255 10.3054 13.7264 8.90625 12.0005 8.90625C10.2746 8.90625 8.87544 10.3054 8.87544 12.0313C8.87544 13.7572 10.2746 15.1562 12.0005 15.1562Z"
                  stroke="#A1A1AA"
                  strokeWidth="1.82"
                />
              </svg>
              <span className="flex-1 text-[16px] font-semibold tracking-[-0.025em] text-zinc-950">
                Advanced
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.75 3.75L12 9L6.75 14.25"
                  stroke="#C4C4C7"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </FamilyPhoneFrame>
    </FamilyStudyStage>
  );
}
