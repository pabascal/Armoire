import { create } from 'zustand';

export const useItemStore = create((set) => ({
  items: [],
  setItems: (items) => set({ items }),

  createItem: async (formData, userId, token) => {
    if (!formData.name || !formData.image) {
      return { success: false, message: 'Please fill in all fields.' };
    }

    const itemData = new FormData(formData);
    itemData.append('name', formData.name);
    itemData.append('image', formData.image);
    itemData.append('userId', userId);
    itemData.append('categories', formData.categories);
    itemData.append('hues', formData.hues);
    itemData.append('tags', formData.tags);
    itemData.append('sellvalue', formData.sellvalue);

    const res = await fetch('/api/items', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: itemData,
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message || 'Error creating item.' };
    }

    set((state) => ({ items: [...state.items, data.data] }));
    return { success: true, message: 'Item created successfully.' };
  },

  fetchItems: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const res = await fetch('/api/items/user', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      set({ items: data }); // This replaces setItems functionality
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Fetch error:`, error);
    }
  },

  deleteItem: async (pid) => {
    try {
      const res = await fetch(`/api/items/${pid}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await res.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to delete item');
      }
  
      // Update the UI immediately without needing refresh
      set((state) => ({ items: state.items.filter((item) => item._id !== pid) }));
      return { success: true, message: data.message };
    } catch (error) {
      console.error('Delete error:', error);
      return { success: false, message: error.message };
    }
  },
  updateItem: async (pid, updatedItem) => {
    try {
      let body;
      let headers = {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      };
  
      if (updatedItem instanceof FormData) {
        body = updatedItem;
      } else {
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify(updatedItem);
      }
  
      const res = await fetch(`/api/items/${pid}`, {
        method: 'PUT',
        headers,
        body
      });
  
      const data = await res.json();
  
      if (!res.ok) { 
        throw new Error(data.message || 'Failed to update item');
      }
      
      set((state) => ({
        items: state.items.map((item) => 
          item._id === pid ? data.data : item
        ),
      }));
      
      return { success: true, message: 'Item updated successfully.' };
    } catch (error) {
      console.error('Update error:', error);
      return { success: false, message: error.message };
    }
  }
}));
