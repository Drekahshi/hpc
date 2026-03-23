// This file can be used to store reusable types and interfaces.
// For example:
// export interface User {
//   id: string;
//   name: string;
//   email: string;
// }

import { Timestamp } from 'firebase/firestore';

export interface Tree {
  id: string;
  hederaTopicId?: string;
  species: {
    commonName: string;
    scientificName: string;
    type: 'indigenous' | 'exotic' | 'medicinal';
  };
  planting: {
    plantedBy: string;
    cfaId: string;
    date: Timestamp;
    location: {
      lat: number;
      lng: number;
      altitude: number;
    };
    nurserySource: string;
  };
  validation: {
    status: 'pending' | 'verified' | 'disputed' | 'dead';
    validators: {
      userId: string;
      validationType: 'tree_planter' | 'ai' | 'community';
      timestamp: Timestamp;
      confidence: number;
      signature: string;
    }[];
    lastVerified: Timestamp | null;
    nextCheckDue: Timestamp;
  };
  growth: {
    date: Timestamp;
    height: number;
    healthScore: number;
    photoHash: string;
    notes: string;
    validatedBy: string;
  }[];
  iotData?: {
    soilMoisture: number;
    temperature: number;
    co2Absorption: number;
    lastSync: Timestamp;
  };
  nftMinted: boolean;
  nftId: string | null;
  status: 'growing' | 'mature' | 'dead' | 'removed';
  createdAt: Timestamp;
}
