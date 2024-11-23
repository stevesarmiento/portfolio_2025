"use client";

import * as React from "react";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandDialog,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { 
    IconPersonTextRectangle, 
    IconHandbagFill, 
    IconArrowRight, 
    IconListBullet,
    IconQrcode,
    IconInfoCircle,
    IconArrowUpForward,
} from "symbols-react";
import { 
    Avatar, 
    AvatarFallback, 
    AvatarImage, 
} from '@/components/ui/avatar';
import { QRCodeSVG } from 'qrcode.react';
import { Separator } from "../ui/separator";

  interface Token {
      id: string;
      symbol: string;
      name: string;
      icon: string;
      balance: string;
      balanceUsd: string;
    }

  interface SwapPreview {
    tokenA: string;
    tokenB: string;
    amount: string;
  }

  interface SendPreview {
      amount: string;
      token: string;
      recipient: string;
    }

  interface QRPreview {
    address: string;
    name: string;
  }
    

  interface CommandPreview {
    type: 'swap' | 'send' | 'qr';
    data: SwapPreview | SendPreview | QRPreview;
  }
    

function parseCommand(input: string): CommandPreview | null {
    // Parse swap command - more flexible pattern
    const swapRegex = /(?:.*?swap.*?|.*?)(?:(\d+(?:\.\d+)?)\s+)?#(\w+)(?:\s+(?:for|to))?\s+#(\w+)/i;
    const swapMatch = input.match(swapRegex);
    
    // Check if we have two # symbols for swap
    const hashCount = (input.match(/#/g) || []).length;
    const hasAtSymbol = input.includes('@');
    
    if (swapMatch && hashCount === 2 && !hasAtSymbol) {
      return {
        type: 'swap',
        data: {
          amount: swapMatch[1] || '0',
          tokenA: swapMatch[2],
          tokenB: swapMatch[3],
        }
      };
    }
  
    // Parse send command - more flexible pattern
    const sendRegex = /(?:.*?send.*?|.*?)(?:(\d+(?:\.\d+)?)\s+)?#(\w+)(?:\s+(?:to))?\s+@(\w+(?:\.\w+)*)|(?:.*?send.*?|.*?)@(\w+(?:\.\w+)*)(?:\s+(?:to))?\s+(\d+(?:\.\d+)?)\s+#(\w+)/i;
    const sendMatch = input.match(sendRegex);
  
    if (sendMatch && hashCount === 1 && hasAtSymbol) {
      // Handle both patterns: "send 24 #USDC to @jake" and "send @jake 24 #USDC"
      if (sendMatch[1] && sendMatch[2] && sendMatch[3]) {
        return {
          type: 'send',
          data: {
            amount: sendMatch[1],
            token: sendMatch[2],
            recipient: sendMatch[3],
          }
        };
      } else {
        return {
          type: 'send',
          data: {
            amount: sendMatch[5],
            token: sendMatch[6],
            recipient: sendMatch[4],
          }
        };
      }
    }
  
    return null;
  }

// Mock data
const tokens: Token[] = [
  { 
    id: 'usdc', 
    symbol: 'USDC', 
    name: 'USD Coin', 
    icon: '/img/token-usdc.svg',
    balance: '1,234.56',
    balanceUsd: '1,234.56'
  },
  { 
    id: 'eth', 
    symbol: 'ETH', 
    name: 'Ethereum', 
    icon: '/img/token-eth.svg',
    balance: '2.45',
    balanceUsd: '4,532.40'
  },
  { 
    id: 'sol', 
    symbol: 'SOL', 
    name: 'Solana', 
    icon: '/img/token-sol.svg',
    balance: '123.45',
    balanceUsd: '8,641.50'
  },
  { 
    id: 'btc', 
    symbol: 'BTC', 
    name: 'Bitcoin', 
    icon: '/img/token-btc.svg',
    balance: '0.056',
    balanceUsd: '2,352.00'
  },
];

const addresses = [
  { id: '1', handle: 'jakey.sol', address: 'HN7cABqLq...', avatar: '🎮' },
  { id: '2', handle: 'steve.sol', address: 'J8K9cABqLq...', avatar: '🚀' },
  { id: '3', handle: 'alice.sol', address: 'P2K9cABqLq...', avatar: '🌟' },
];

export function WalletCommander() {
    const [open, setOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState("");
    const [suggestionType, setSuggestionType] = React.useState<'token' | 'address' | null>(null);
    const [filterValue, setFilterValue] = React.useState("");
    const [preview, setPreview] = React.useState<CommandPreview | null>(null);
  
    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
          if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            setOpen((open) => !open);
          }
        };
    
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
      }, []);

      const handleOpenChange = (open: boolean) => {
        setOpen(open);
        if (!open) {
          // Reset states when dialog closes
          setInputValue("");
          setSuggestionType(null);
          setFilterValue("");
          setPreview(null);
        }
      };

    const handleInputChange = (value: string) => {
        setInputValue(value);
        
        // Check for commands
        const command = parseCommand(value);
        if (command) {
          setPreview(command);
          setSuggestionType(null);
          return;
        }
        
        // Token/address suggestions
        if (value.includes('#')) {
          setSuggestionType('token');
          setFilterValue(value.split('#').pop() || "");
          setPreview(null);
          return;
        }
        
        if (value.includes('@')) {
          setSuggestionType('address');
          setFilterValue(value.split('@').pop() || "");
          setPreview(null);
          return;
        }

            // Add QR code command detection
        if (value.toLowerCase() === 'r' || value.toLowerCase() === 'receive') {
          setPreview({
            type: 'qr',
            data: {
              address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', // Example address
              name: 'burger.sol'
            }
          });
          setSuggestionType(null);
          return;
        }
    
        setSuggestionType(null);
        setFilterValue("");
        setPreview(null);
      };
  
    const handleSelect = (selectedValue: string) => {
        let newValue = inputValue;
        const lastHashIndex = inputValue.lastIndexOf('#');
        const lastAtIndex = inputValue.lastIndexOf('@');
      
        if (suggestionType === 'token' && lastHashIndex !== -1) {
          // Check if we're in the middle of a command
          const hasTextAfter = inputValue.slice(lastHashIndex).includes(' ');
          newValue = inputValue.substring(0, lastHashIndex) + `#${selectedValue}${hasTextAfter ? '' : ' '}`;
        } else if (suggestionType === 'address' && lastAtIndex !== -1) {
          // Check if we're in the middle of a command
          const hasTextAfter = inputValue.slice(lastAtIndex).includes(' ');
          newValue = inputValue.substring(0, lastAtIndex) + `@${selectedValue}${hasTextAfter ? '' : ' '}`;
        }
        
        setInputValue(newValue);
        setSuggestionType(null);
        setFilterValue("");
      };

  const filteredTokens = tokens.filter(token => 
    token.symbol.toLowerCase().includes(filterValue.toLowerCase()) ||
    token.name.toLowerCase().includes(filterValue.toLowerCase())
  );

  const filteredAddresses = addresses.filter(addr =>
    addr.handle.toLowerCase().includes(filterValue.toLowerCase()) ||
    addr.address.toLowerCase().includes(filterValue.toLowerCase())
  );
  
  return (
    <>
    <Button
        variant="ghost"
        className="relative bg-white h-10 w-full justify-start rounded-[0.5rem] text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
    >
        <span className="inline-flex text-black/50 font-mono font-normal tracking-tighter">Wallet Command</span>
        <kbd className="pointer-events-none absolute right-1.5 bg-primary/10 text-primary px-2 border border-primary/10 shadow font-medium font-mono rounded-md text-xs flex items-center gap-1">
        <span className="text-lg">⌘</span>K
        </kbd>
    </Button>
    <CommandDialog open={open} onOpenChange={handleOpenChange}>
    <div className="w-full">
      <Command shouldFilter={false} className="rounded-lg border shadow-md">
        <CommandInput
          placeholder="What do you want to do?"
          value={inputValue}
          onValueChange={handleInputChange}
          className="w-full"
        />
        <CommandList className="w-full bg-popover rounded-b-lg shadow-md">
            {!preview && !suggestionType && (
                <>
                    <div className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10 rounded-xl">
                            <AvatarImage src="/img/bitmap-avvy.png" alt="Burger.eth" />
                            <AvatarFallback className="text-xl bg-green-400 rounded-full">🌮</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="font-medium">burger.sol</span>
                            <span className="text-sm text-muted-foreground truncate">
                            0xd8dA...6653
                            </span>
                        </div>
                        </div>
                        <div className="flex flex-col items-end">
                        <div className="flex items-center space-x-1">
                            <span className="font-medium">2.45</span>
                            <span className="text-sm text-muted-foreground">SOL</span>
                        </div>
                        <span className="text-sm text-muted-foreground">≈ $4,532.40</span>
                        </div>
                    </div>
                    </div>
                    <CommandSeparator />
                    <CommandGroup heading="Available Commands">
                        <div className="px-2 py-2 space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div className="p-2 rounded-lg bg-accent/10">
                                  <IconHandbagFill className="h-4 w-4 fill-black/40" />
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-medium text-sm text-muted-foreground">Available tokens</span>
                                </div>
                              </div>
                              <kbd className="bg-primary/10 text-primary px-2 py-1 border border-primary/10 shadow font-medium font-mono rounded-md text-xs flex items-center gap-1">
                                #
                              </kbd>
                            </div>
          
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div className="p-2 rounded-lg bg-accent/10">
                                  <IconPersonTextRectangle className="h-4 w-4 fill-black/40" />
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-medium text-sm text-muted-foreground">Saved Addresses</span>
                                </div>
                              </div>
                              <kbd className="bg-primary/10 text-primary px-2 py-1 border border-primary/10 shadow font-medium font-mono rounded-md text-xs flex items-center gap-1">
                                @
                              </kbd>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div className="p-2 rounded-lg bg-accent/10">
                                  <IconListBullet className="h-4 w-4 fill-black/40" />
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-medium text-sm text-muted-foreground">Wallet Transactions</span>
                                </div>
                              </div>
                              <kbd className="bg-primary/10 text-primary px-2 py-1 border border-primary/10 shadow font-medium font-mono rounded-md text-xs flex items-center gap-1">
                                T
                              </kbd>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div className="p-2 rounded-lg bg-accent/10">
                                  <IconQrcode className="h-4 w-4 fill-black/40" />
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-medium text-sm text-muted-foreground">Show Receive QR</span>
                                </div>
                              </div>
                              <kbd className="bg-primary/10 text-primary px-2 py-1 border border-primary/10 shadow font-medium font-mono rounded-md text-xs flex items-center gap-1">
                                R
                              </kbd>
                            </div>
                          </div>
                    </CommandGroup>
                </>
            )}

          {/* Swap Preview */}
          {preview && preview.type === 'swap' && (
            <>
            <CommandGroup heading="Swap">
              <div className="relative flex flex-row justify-between items-center space-x-3">
                  <div className="flex-1 items-center justify-between space-x-3 overflow-hidden">
                    {/* Token A */}
                    <div className="w-full p-2 px-3 bg-black/5 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage 
                              src={tokens.find(t => t.symbol.toLowerCase() === (preview.data as SwapPreview).tokenA.toLowerCase())?.icon} 
                              alt={(preview.data as SwapPreview).tokenA} 
                            />
                            <AvatarFallback>{(preview.data as SwapPreview).tokenA[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col items-start">
                            <span className="font-bold">{(preview.data as SwapPreview).tokenA}</span>
                            <Button 
                              variant="ghost" 
                              className="h-6 px-0 text-xs hover:bg-transparent text-black/40 hover:text-black/60"
                              endIcon={<IconArrowUpForward className="h-2 w-2 fill-black/30" />}
                            >
                              <span className="font-mono text-xs font-normal tracking-tighter">EPjFW...TDt1v</span>
                            </Button>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-sm text-muted-foreground">Send</span>
                          <span className="font-medium text-black">{(preview.data as SwapPreview).amount}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between space-x-3 overflow-hidden">
                    <span className="text-muted-foreground">to</span>
                  </div>
                  
                  {/* <div className="absolute left-[26px] top-[57px]">
                    <div
                          style={{
                            left: '10px',
                            top: '0px',
                            bottom: '28px',
                            width: '16px',
                          }}
                          className="border-l-4 h-[32px] border-border"
                        />
                      <div className="z-0 top-[7px] left-[2px] w-4.5 h-3 border-b-4 border-l-4 border-border rounded-bl-full"></div>
                  </div> */}

                  <div className="flex-1 items-center justify-between space-x-3 overflow-hidden">
                    {/* Token B */}
                    <div className="w-full p-2 px-3 ml-auto bg-black/5 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage 
                              src={tokens.find(t => t.symbol.toLowerCase() === (preview.data as SwapPreview).tokenB.toLowerCase())?.icon} 
                              alt={(preview.data as SwapPreview).tokenB} 
                            />
                            <AvatarFallback>{(preview.data as SwapPreview).tokenB[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col items-start">
                            <span className="font-bold">{(preview.data as SwapPreview).tokenB}</span>
                            <Button 
                              variant="ghost" 
                              className="h-6 px-0 text-xs hover:bg-transparent text-black/40 hover:text-black/60"
                              endIcon={<IconArrowUpForward className="h-2 w-2 fill-black/30" />}
                            >
                              <span className="font-mono text-xs font-normal tracking-tighter">So111...11112</span>
                            </Button>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-sm text-muted-foreground">Receive</span>
                          <span className="font-medium text-black">0</span>
                          </div>
                      </div>
                    </div>
                  </div>
                </div>
    
              {/* <div className="space-y-2 p-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    Best price
                    <IconInfoCircle className="h-4 w-4 text-muted-foreground" />
                  </span>
                  <span>
                    {(preview.data as SwapPreview).amount} {(preview.data as SwapPreview).tokenA} per {(preview.data as SwapPreview).tokenB}
                  </span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    Minimum received
                    <IconInfoCircle className="h-4 w-4 text-muted-foreground" />
                  </span>
                  <span>≈ {(parseFloat((preview.data as SwapPreview).amount) * 0.995).toFixed(6)} {(preview.data as SwapPreview).tokenB}</span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    Price impact
                    <IconInfoCircle className="h-4 w-4 text-muted-foreground" />
                  </span>
                  <span className="text-green-500">{"< 0.01%"}</span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    Network fee
                    <IconInfoCircle className="h-4 w-4 text-muted-foreground" />
                  </span>
                  <span>≈ $0.15</span>
                </div>
              </div> */}
            </CommandGroup> 

            <Separator className="bg-black/10 my-2" />

            <CommandGroup heading="Summery">
              <div className="px-2 pb-3 text-sm text-black/40 leading-loose">
                  <p>
                    You&apos;re attempting to swap{' '}
                    <span className="font-medium font-mono text-foreground bg-black/5 p-1 rounded-md">
                      {(preview.data as SwapPreview).amount} {(preview.data as SwapPreview).tokenA}
                    </span>{' '}
                    for{' '}
                    <span className="font-medium font-mono text-foreground bg-black/5 p-1 rounded-md">
                      {(preview.data as SwapPreview).tokenB}
                    </span>{' '}
                    - You should receive at least{' '}
                    <span className="font-medium font-mono text-foreground bg-black/5 p-1 rounded-md">
                      {(parseFloat((preview.data as SwapPreview).amount) * 0.995).toFixed(6)} {(preview.data as SwapPreview).tokenB}
                    </span>{' '}
                    with a minimal price impact of{' '}
                    <span className="text-green-500 font-mono font-medium bg-green-500/5 p-1 rounded-md">
                       {'<'} 0.01%
                    </span>
                    . The network fee for this transaction will be approximately{' '}
                    <span className="font-medium font-mono text-foreground bg-black/5 p-1 rounded-md">
                      $0.15
                    </span>
                    .
                  </p>
                </div>  
            </CommandGroup>
           </>

          )}

          {/* Send Preview */}
          {preview && preview.type === 'send' && (
            <>
              <CommandGroup heading="Send">
                <div className="relative flex flex-row justify-between items-center space-x-3">
                  <div className="flex-1 items-center justify-between space-x-3 overflow-hidden">
                    {/* Token */}
                    <div className="w-full p-2 px-3 bg-black/5 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage 
                              src={tokens.find(t => t.symbol.toLowerCase() === (preview.data as SendPreview).token.toLowerCase())?.icon} 
                              alt={(preview.data as SendPreview).token} 
                            />
                            <AvatarFallback>{(preview.data as SendPreview).token[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col items-start">
                            <span className="font-bold">{(preview.data as SendPreview).token}</span>
                            <Button 
                              variant="ghost" 
                              className="h-6 px-0 text-xs hover:bg-transparent text-black/40 hover:text-black/60"
                              endIcon={<IconArrowUpForward className="h-2 w-2 fill-black/30" />}
                            >
                              <span className="font-mono text-xs font-normal tracking-tighter">EPjFW...TDt1v</span>
                            </Button>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-sm text-muted-foreground">Send</span>
                          <span className="font-medium text-black">{(preview.data as SendPreview).amount}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between space-x-3 overflow-hidden">
                    <span className="text-muted-foreground">to</span>
                  </div>

                  <div className="flex-1 items-center justify-between space-x-3 overflow-hidden">
                    {/* Recipient */}
                    <div className="w-full p-2 px-3 ml-auto bg-black/5 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage 
                              src={addresses.find(a => a.handle.toLowerCase() === (preview.data as SendPreview).recipient.toLowerCase())?.avatar} 
                              alt={(preview.data as SendPreview).recipient} 
                            />
                            <AvatarFallback>
                              {(preview.data as SendPreview).recipient[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col items-start">
                            <span className="font-bold">{(preview.data as SendPreview).recipient}</span>
                            <Button 
                              variant="ghost" 
                              className="h-6 px-0 text-xs hover:bg-transparent text-black/40 hover:text-black/60"
                              endIcon={<IconArrowUpForward className="h-2 w-2 fill-black/30" />}
                            >
                              <span className="font-mono text-xs font-normal tracking-tighter">
                                {addresses.find(a => a.handle.toLowerCase() === (preview.data as SendPreview).recipient.toLowerCase())?.address}
                              </span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CommandGroup>

              <Separator className="bg-black/10 my-2" />

              <CommandGroup heading="Summary">
                <div className="px-2 pb-3 text-sm text-black/40 leading-loose">
                  <p>
                    You&apos;re sending{' '}
                    <span className="font-medium font-mono text-foreground bg-black/5 p-1 rounded-md">
                      {(preview.data as SendPreview).amount} 
                      </span>{' '}
                    in{' '}
                    <span className="font-medium font-mono text-foreground bg-black/5 p-1 rounded-md">
                      {(preview.data as SendPreview).token}
                    </span>{' '}
                    to{' '}
                    <span className="font-medium font-mono text-foreground bg-black/5 p-1 rounded-md">
                      {(preview.data as SendPreview).recipient}
                    </span>
                    . The network fee for this transaction will be approximately{' '}
                    <span className="font-medium font-mono text-foreground bg-black/5 p-1 rounded-md">
                      $0.15
                    </span>
                    .
                  </p>
                </div>
              </CommandGroup>
            </>
          )}
        {/* Add QR Preview */}
        {preview && preview.type === 'qr' && (
          <CommandGroup heading="Your Receive Address">
            <div className="p-4">
              <div className="flex items-start space-x-4">
                {/* QR Code */}
                <div className="bg-white p-3 rounded-lg shrink-0">
                  <QRCodeSVG
                    value={(preview.data as QRPreview).address}
                    size={150}
                    level="H"
                    includeMargin={true}
                    imageSettings={{
                      src: "/img/bitmap-avvy.png",
                      height: 30,
                      width: 30,
                      excavate: true,
                    }}
                  />
                </div>

                {/* Details */}
                <div className="flex-1 space-y-4">
                  {/* Profile Info */}
                  <div className="flex items-center space-x-2 bg-accent/10 p-3 rounded-lg">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/img/bitmap-avvy.png" alt="Profile" />
                      <AvatarFallback>BE</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                      <span className="font-medium">{(preview.data as QRPreview).name}</span>
                      <span className="text-sm text-muted-foreground truncate">
                        {(preview.data as QRPreview).address}
                      </span>
                    </div>
                  </div>

                  {/* Network Details */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        Network
                        <IconInfoCircle className="h-4 w-4 text-muted-foreground" />
                      </span>
                      <span>Solana</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        Address Type
                        <IconInfoCircle className="h-4 w-4 text-muted-foreground" />
                      </span>
                      <span>Native</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CommandGroup>
        )}

          {/* Existing token suggestions */}
          {suggestionType === 'token' && (
            <CommandGroup heading="Select Token">
                {filteredTokens.map((token) => (
                <CommandItem
                    key={token.id}
                    value={token.symbol}
                    onSelect={handleSelect}
                    className="flex items-center justify-between px-4 py-3 hover:bg-accent cursor-pointer group"
                >
                    <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={token.icon} alt={token.symbol} />
                        <AvatarFallback>{token.symbol[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-medium">{token.symbol}</span>
                        <span className="text-sm text-muted-foreground">{token.name}</span>
                    </div>
                    </div>
                    <div className="flex flex-col items-end">
                    <span className="font-medium">{token.balance}</span>
                    <span className="text-sm text-muted-foreground">${token.balanceUsd}</span>
                    </div>
                </CommandItem>
                ))}
            </CommandGroup>
            )}

          {/* Existing address suggestions */}
          {suggestionType === 'address' && (
            <CommandGroup heading="Select Address">
                {filteredAddresses.map((addr) => (
                <CommandItem
                    key={addr.id}
                    value={addr.handle}
                    onSelect={handleSelect}
                    className="flex items-center justify-between px-4 py-3 hover:bg-accent cursor-pointer group"
                >
                    <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={addr.avatar} alt={addr.handle} />
                        <AvatarFallback>{addr.handle[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-medium">{addr.handle}</span>
                        <span className="text-sm text-muted-foreground truncate">
                        {addr.address}
                        </span>
                    </div>
                    </div>
                </CommandItem>
                ))}
            </CommandGroup>
            )}
        </CommandList>
      </Command>
    </div>
      </CommandDialog>
    </>
  );
}