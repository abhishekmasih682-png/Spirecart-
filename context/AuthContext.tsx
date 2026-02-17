import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Address } from '../types';

interface User {
  name: string;
  phone: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  // Address Management
  savedAddresses: Address[];
  addAddress: (address: Omit<Address, 'id'>) => void;
  editAddress: (id: string, address: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  detectLocation: () => Promise<Omit<Address, 'id' | 'isDefault' | 'tag'> | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock Initial Addresses
const INITIAL_ADDRESSES: Address[] = [
  {
    id: 'addr_1',
    tag: 'Home',
    street: '123, Tech Park Residency, Sector 4',
    area: 'Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    zip: '560038',
    isDefault: true
  },
  {
    id: 'addr_2',
    tag: 'Work',
    street: 'Spire Towers, 4th Floor, ORR',
    area: 'Marathahalli',
    city: 'Bengaluru',
    state: 'Karnataka',
    zip: '560037',
    isDefault: false
  }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);

  // Load addresses when user logs in (Simulated)
  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem('spire_addresses');
      if (stored) {
        setSavedAddresses(JSON.parse(stored));
      } else {
        setSavedAddresses(INITIAL_ADDRESSES);
      }
    } else {
      setSavedAddresses([]);
    }
  }, [user]);

  // Persist addresses
  useEffect(() => {
    if (user && savedAddresses.length > 0) {
      localStorage.setItem('spire_addresses', JSON.stringify(savedAddresses));
    }
  }, [savedAddresses, user]);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('spire_addresses');
  };

  const addAddress = (address: Omit<Address, 'id'>) => {
    const newAddress = { ...address, id: `addr_${Date.now()}` };
    if (newAddress.isDefault) {
       // If adding as default, remove default from others
       setSavedAddresses(prev => prev.map(a => ({...a, isDefault: false})).concat(newAddress));
    } else {
       // If first address, make it default automatically
       if (savedAddresses.length === 0) newAddress.isDefault = true;
       setSavedAddresses(prev => [...prev, newAddress]);
    }
  };

  const editAddress = (id: string, updatedData: Partial<Address>) => {
    setSavedAddresses(prev => {
        const newData = prev.map(addr => addr.id === id ? { ...addr, ...updatedData } : addr);
        // Handle default switching logic
        if (updatedData.isDefault) {
            return newData.map(addr => addr.id === id ? addr : { ...addr, isDefault: false });
        }
        return newData;
    });
  };

  const deleteAddress = (id: string) => {
    setSavedAddresses(prev => {
        const remaining = prev.filter(a => a.id !== id);
        // If we deleted the default, make the first one default
        if (remaining.length > 0 && !remaining.some(a => a.isDefault)) {
            remaining[0].isDefault = true;
        }
        return remaining;
    });
  };

  const setDefaultAddress = (id: string) => {
      setSavedAddresses(prev => prev.map(addr => ({
          ...addr,
          isDefault: addr.id === id
      })));
  };

  const detectLocation = async (): Promise<Omit<Address, 'id' | 'isDefault' | 'tag'> | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser');
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Simulated Reverse Geocoding
          // In a real app, use Google Maps Geocoding API here
          // We simulate a delay and return a mock address based on coordinates
          setTimeout(() => {
            resolve({
              street: `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`, 
              area: 'GPS Locality',
              city: 'Bengaluru',
              state: 'Karnataka',
              zip: '560001'
            });
          }, 1500);
        },
        (error) => {
          console.error("Geolocation Error:", error);
          let msg = 'Unable to retrieve location.';
          if (error.code === 1) msg = 'Location permission denied.';
          else if (error.code === 2) msg = 'Location unavailable.';
          else if (error.code === 3) msg = 'Location request timed out.';
          alert(msg);
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  };

  return (
    <AuthContext.Provider value={{ 
        user, 
        login, 
        logout, 
        isAuthenticated: !!user,
        savedAddresses,
        addAddress,
        editAddress,
        deleteAddress,
        setDefaultAddress,
        detectLocation
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};