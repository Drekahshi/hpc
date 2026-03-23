'use client';

import { useWallet } from '@/hooks/use-wallet';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User, Wallet } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function ConnectWalletButton() {
  const {
    account,
    walletType,
    connectMetaMask,
    connectHashPack,
    disconnect,
  } = useWallet();

  const formatAddress = (address: string) => {
    if (address.length > 10) {
      return `${address.substring(0, 5)}...${address.substring(address.length - 4)}`;
    }
    return address;
  };

  if (account) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <span>{formatAddress(account)}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={disconnect}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Disconnect</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={connectMetaMask}>
          Connect MetaMask
        </DropdownMenuItem>
        <DropdownMenuItem onClick={connectHashPack}>
          Connect HashPack
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
