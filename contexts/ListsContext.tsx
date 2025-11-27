'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Company } from '@/data/companies';
import { Person } from '@/data/people';

interface List {
  id: string;
  name: string;
  type: 'companies' | 'people';
  items: string[]; // IDs
  createdAt: Date;
}

interface ListsContextType {
  lists: List[];
  createList: (name: string, type: 'companies' | 'people') => void;
  addToList: (listId: string, itemIds: string[]) => void;
  removeFromList: (listId: string, itemIds: string[]) => void;
  getListsByType: (type: 'companies' | 'people') => List[];
}

const ListsContext = createContext<ListsContextType | undefined>(undefined);

export function ListsProvider({ children }: { children: ReactNode }) {
  const [lists, setLists] = useState<List[]>([
    {
      id: 'list-1',
      name: 'Prospección Q1 2025',
      type: 'companies',
      items: [],
      createdAt: new Date(),
    },
    {
      id: 'list-2',
      name: 'Leads Calificados',
      type: 'people',
      items: [],
      createdAt: new Date(),
    },
  ]);

  const createList = (name: string, type: 'companies' | 'people') => {
    const newList: List = {
      id: `list-${Date.now()}`,
      name,
      type,
      items: [],
      createdAt: new Date(),
    };
    setLists(prev => [...prev, newList]);
  };

  const addToList = (listId: string, itemIds: string[]) => {
    setLists(prev =>
      prev.map(list =>
        list.id === listId
          ? { ...list, items: [...new Set([...list.items, ...itemIds])] }
          : list
      )
    );
  };

  const removeFromList = (listId: string, itemIds: string[]) => {
    setLists(prev =>
      prev.map(list =>
        list.id === listId
          ? { ...list, items: list.items.filter(id => !itemIds.includes(id)) }
          : list
      )
    );
  };

  const getListsByType = (type: 'companies' | 'people') => {
    return lists.filter(list => list.type === type);
  };

  return (
    <ListsContext.Provider
      value={{ lists, createList, addToList, removeFromList, getListsByType }}
    >
      {children}
    </ListsContext.Provider>
  );
}

export function useLists() {
  const context = useContext(ListsContext);
  if (!context) {
    throw new Error('useLists must be used within ListsProvider');
  }
  return context;
}
