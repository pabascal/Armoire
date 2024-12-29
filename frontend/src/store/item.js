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
          'Authorization': `Bearer ${token}`,
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
  fetchItems: async (token) => {
    if (!token) return;
    try {
      const res = await fetch('/api/items/user', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      const data = await res.json();
      if (!res.ok) {
        console.error('Server error:', data);
        return;
      }
      set({ items: data });  // This replaces setItems functionality
    } catch (error) {
      console.error('Error:', error);
    }
  },
  deleteItem: async (pid) => {
    const res = await fetch(`/api/items/${pid}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    //update the ui immediately without needing refresh
    set((state) => ({ items: state.items.filter((item) => item._id !== pid) }));
    return { success: true, message: data.message };
  },
  updateItem: async (pid, updatedItem) => {
  try {
    const res = await fetch(`/api/items/${pid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,  // Added auth token
      },
      body: JSON.stringify(updatedItem),  // Added JSON.stringify
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.message || 'Error updating item.' };
    }

    // Update the ui immediately, without needing a refresh
    set((state) => ({
      items: state.items.map((item) => (item._id === pid ? data.data : item)),
    }));
    
    return { success: true, message: 'Item updated successfully.' };
  } catch (error) {
    console.error('Update error:', error);
    return { success: false, message: error.message || 'Failed to update item' };
  }
}
}
));
