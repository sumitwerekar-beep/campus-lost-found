import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { INITIAL_MOCK_ITEMS, INITIAL_USER_PROFILE } from '../data/mockItems';

const STORAGE_KEY_ITEMS = '@campus_lost_found_items_v3';
const STORAGE_KEY_PROFILE = '@campus_lost_found_profile_v3';

export const ItemsContext = createContext({
  items: INITIAL_MOCK_ITEMS,
  userProfile: INITIAL_USER_PROFILE,
  loading: false,
  error: null,
  addItem: async () => {},
  updateItemStatus: async () => {},
  deleteItem: async () => {},
  updateUserProfile: async () => {},
  resetToMockData: async () => {},
  stats: {
    total: INITIAL_MOCK_ITEMS.length,
    lost: 3,
    found: 2,
    claimed: 1,
    myReports: 3
  }
});

export const ItemsProvider = ({ children }) => {
  const [items, setItems] = useState(INITIAL_MOCK_ITEMS);
  const [userProfile, setUserProfile] = useState(INITIAL_USER_PROFILE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load data from storage safely
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load stored items with fallback
      const storedItems = await AsyncStorage.getItem(STORAGE_KEY_ITEMS);
      if (storedItems) {
        const parsed = JSON.parse(storedItems);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems(parsed);
        } else {
          setItems(INITIAL_MOCK_ITEMS);
        }
      } else {
        await AsyncStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(INITIAL_MOCK_ITEMS));
        setItems(INITIAL_MOCK_ITEMS);
      }

      // Load profile
      const storedProfile = await AsyncStorage.getItem(STORAGE_KEY_PROFILE);
      if (storedProfile) {
        setUserProfile(JSON.parse(storedProfile));
      } else {
        await AsyncStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(INITIAL_USER_PROFILE));
        setUserProfile(INITIAL_USER_PROFILE);
      }
    } catch (e) {
      console.warn('AsyncStorage load notice (using memory state):', e);
      setItems(INITIAL_MOCK_ITEMS);
    } finally {
      setLoading(false);
    }
  };

  const saveItems = async (newItems) => {
    try {
      setItems(newItems);
      await AsyncStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(newItems));
    } catch (e) {
      console.warn('Failed to persist items:', e);
    }
  };

  const addItem = async (itemData) => {
    const newItem = {
      id: 'item-' + Date.now(),
      name: itemData.name,
      description: itemData.description || '',
      category: itemData.category,
      location: itemData.location,
      date: itemData.date || new Date().toISOString().split('T')[0],
      status: itemData.status || 'Lost',
      imageUri: itemData.imageUri || null,
      contactName: itemData.contactName || userProfile.name,
      contactPhone: itemData.contactPhone || userProfile.phone,
      contactEmail: itemData.contactEmail || userProfile.email,
      isUserReported: true,
      createdAt: new Date().toISOString()
    };

    const updatedItems = [newItem, ...items];
    await saveItems(updatedItems);
    return newItem;
  };

  const updateItemStatus = async (id, newStatus) => {
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        return { ...item, status: newStatus };
      }
      return item;
    });
    await saveItems(updatedItems);
  };

  const deleteItem = async (id) => {
    const updatedItems = items.filter((item) => item.id !== id);
    await saveItems(updatedItems);
  };

  const updateUserProfile = async (profileData) => {
    try {
      const updatedProfile = { ...userProfile, ...profileData };
      setUserProfile(updatedProfile);
      await AsyncStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(updatedProfile));
    } catch (e) {
      console.warn('Failed to save profile:', e);
    }
  };

  const resetToMockData = async () => {
    try {
      setLoading(true);
      await AsyncStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(INITIAL_MOCK_ITEMS));
      await AsyncStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(INITIAL_USER_PROFILE));
      setItems(INITIAL_MOCK_ITEMS);
      setUserProfile(INITIAL_USER_PROFILE);
    } catch (e) {
      setItems(INITIAL_MOCK_ITEMS);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: items.length,
    lost: items.filter((i) => i.status === 'Lost').length,
    found: items.filter((i) => i.status === 'Found').length,
    claimed: items.filter((i) => i.status === 'Claimed').length,
    myReports: items.filter((i) => i.isUserReported).length
  };

  return (
    <ItemsContext.Provider
      value={{
        items,
        userProfile,
        loading,
        error,
        addItem,
        updateItemStatus,
        deleteItem,
        updateUserProfile,
        resetToMockData,
        stats,
        reload: loadData
      }}
    >
      {children}
    </ItemsContext.Provider>
  );
};

export const useItems = () => useContext(ItemsContext);
