import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';

const BusinessContext = createContext(null);

export function BusinessProvider({ children }) {
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState(() => {
    return localStorage.getItem('cashflow_active_business_id') || null;
  });
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [backendOnline, setBackendOnline] = useState(true);

  const fetchBusinesses = useCallback(async (autoSelectId = null) => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getBusinesses();
      const list = Array.isArray(data) ? data : [];
      setBusinesses(list);
      setBackendOnline(true);

      if (list.length > 0) {
        let targetId = autoSelectId || selectedBusinessId;
        let match = list.find((b) => String(b.id) === String(targetId));
        if (!match) {
          match = list[0];
        }
        setSelectedBusiness(match);
        setSelectedBusinessId(String(match.id));
        localStorage.setItem('cashflow_active_business_id', String(match.id));
      } else {
        setSelectedBusiness(null);
        setSelectedBusinessId(null);
      }
    } catch (err) {
      console.error('Failed to connect to CashFlow OS backend:', err);
      setError(err.message || 'Unable to connect to Spring Boot backend');
      setBackendOnline(false);
    } finally {
      setLoading(false);
    }
  }, [selectedBusinessId]);

  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  const selectBusiness = (id) => {
    const match = businesses.find((b) => String(b.id) === String(id));
    if (match) {
      setSelectedBusiness(match);
      setSelectedBusinessId(String(match.id));
      localStorage.setItem('cashflow_active_business_id', String(match.id));
    }
  };

  const addBusiness = async (newBusinessData) => {
    const created = await api.createBusiness(newBusinessData);
    await fetchBusinesses(created.id);
    return created;
  };

  return (
    <BusinessContext.Provider
      value={{
        businesses,
        selectedBusiness,
        selectedBusinessId,
        selectBusiness,
        addBusiness,
        refreshBusinesses: fetchBusinesses,
        loading,
        error,
        backendOnline,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
}
