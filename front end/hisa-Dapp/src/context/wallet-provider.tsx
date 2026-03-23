'use client';

import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { HashConnect, HashConnectTypes } from 'hashconnect';

type WalletType = 'metamask' | 'hashpack' | null;

interface WalletState {
  account: string | null;
  walletType: WalletType;
  connectMetaMask: () => Promise<void>;
  connectHashPack: () => Promise<void>;
  disconnect: () => void;
}

export const WalletContext = createContext<WalletState | undefined>(undefined);

const appMetadata: HashConnectTypes.AppMetadata = {
  name: 'JANI dApp',
  description: 'JANI Conservation Project',
  icon: 'https://www.hashpack.app/img/logo.svg',
};

let hashconnect: HashConnect;

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [walletType, setWalletType] = useState<WalletType>(null);
  
  const disconnect = useCallback(() => {
    setAccount(null);
    setWalletType(null);
    localStorage.removeItem('walletAccount');
    localStorage.removeItem('walletType');
    if (walletType === 'hashpack' && hashconnect) {
        // Find pairing and disconnect
        const pairingData = hashconnect.getPairingData();
        if(pairingData && pairingData.length > 0) {
            hashconnect.disconnect(pairingData[0].topic);
        }
    }
  }, [walletType]);

  const initHashConnect = useCallback(async () => {
    if (!hashconnect) {
      hashconnect = new HashConnect(true);
    }

    hashconnect.pairingEvent.on((pairingData) => {
        if(pairingData.accountIds && pairingData.accountIds.length > 0) {
            const accId = pairingData.accountIds[0];
            setAccount(accId);
            setWalletType('hashpack');
            localStorage.setItem('walletAccount', accId);
            localStorage.setItem('walletType', 'hashpack');
        }
    });

    await hashconnect.init(appMetadata, 'testnet', false);
  }, []);
  
  useEffect(() => {
    const storedAccount = localStorage.getItem('walletAccount');
    const storedWalletType = localStorage.getItem('walletType') as WalletType;

    if (storedAccount && storedWalletType) {
      setAccount(storedAccount);
      setWalletType(storedWalletType);
      if(storedWalletType === 'hashpack') {
        initHashConnect();
      }
    }
  }, [initHashConnect]);

  const connectMetaMask = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        setAccount(account);
        setWalletType('metamask');
        localStorage.setItem('walletAccount', account);
        localStorage.setItem('walletType', 'metamask');
      } catch (error) {
        console.error('MetaMask connection error:', error);
      }
    } else {
      alert('MetaMask is not installed. Please install it to continue.');
    }
  };

  const connectHashPack = async () => {
    await initHashConnect();
    hashconnect.connectToLocalWallet();
  };

  const value = {
    account,
    walletType,
    connectMetaMask,
    connectHashPack,
    disconnect,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
