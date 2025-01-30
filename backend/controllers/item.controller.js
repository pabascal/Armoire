import Item from '../models/item.model.js';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import cloudinaryConfig from '../config/cloudinary.js';
import User from '../models/user.model.js';

export const getItems = async (req, res) => {
  try {
    console.log('Starting getItems');
    const items = await Item.find({ user: req.user._id }).maxTimeMS(15000);

    if (!items) {
      return res.status(404).json({ message: 'No items found' });
    }

    console.log('Items found:', items.length);
    res.status(200).json(items);
    console.log('Response sent');
  } catch (error) {
    console.error('getItems error:', error);

    if (error.name === 'MongooseError') {
      return res.status(500).json({ message: 'Database connection error' });
    }

    res.status(500).json({ message: error.message });
  }
};

export const getUserBanks = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      categoryBank: user.categoryBank || [],
      hueBank: user.hueBank || [],
      tagBank: user.tagBank || []
    });
  } catch (error) {
    console.error('Error fetching user banks:', error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteFromBank = async (req, res) => {
  try {
    const { type, tag } = req.params;
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate bank type
    const bankField = type === 'categories' ? 'categoryBank' : 
                     type === 'hues' ? 'hueBank' : 
                     type === 'tags' ? 'tagBank' : null;

    if (!bankField) {
      return res.status(400).json({ message: 'Invalid bank type' });
    }

    // Remove the tag from the specified bank
    if (!user[bankField].includes(tag)) {
      return res.status(404).json({ message: 'Tag not found in bank' });
    }

    user[bankField] = user[bankField].filter(item => item !== tag);
    await user.save();

    res.status(200).json({
      message: `Tag deleted successfully from ${type}`,
      [bankField]: user[bankField]
    });
    
  } catch (error) {
    console.error(`Error deleting from bank:`, error);
    res.status(500).json({ message: error.message });
  }
};

export const createItem = async (req, res) => {
  try {
    const { name, categories, hues, tags, sellvalue } = req.body;
    const userId = req.user._id;

    if (!name || !req.file) {
      return res.status(400).json({ success: false, message: 'Please provide all fields' });
    }

    const categoryArray = categories ? categories.split(',').map(c => c.trim()) : [];
    const hueArray = hues ? hues.split(',').map(h => h.trim()) : [];
    const tagArray = tags ? tags.split(',').map(t => t.trim()) : [];

    const newItem = new Item({
      name,
      categories: categoryArray,
      hues: hueArray,
      tags: tagArray,
      sellvalue,
      image: req.file.path,
      user: userId,
    });

    const savedItem = await newItem.save();

    await User.findByIdAndUpdate(userId, {
      $addToSet: {
        categoryBank: { $each: categoryArray },
        hueBank: { $each: hueArray },
        tagBank: { $each: tagArray }
      }
    });
    
    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    console.error('Error in Create Item:', error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const updateItem = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: 'Invalid Item Id' });
  }

  try {
    const existingItem = await Item.findById(id);
    if (!existingItem) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    

    const updateData = {};
    if (req.body.name) updateData.name = req.body.name;
    if (req.body.categories) {
      updateData.categories = Array.isArray(req.body.categories) ? req.body.categories : req.body.categories.split(',');
    }
    if (req.body.hues) {
      updateData.hues = Array.isArray(req.body.hues) ? req.body.hues : req.body.hues.split(',');
    }
    if (req.body.tags) {
      updateData.tags = Array.isArray(req.body.tags) ? req.body.tags : req.body.tags.split(',');
    }
    if (req.body.sellvalue !== undefined) updateData.sellvalue = req.body.sellvalue;

    if (req.file) {
      if (existingItem.image && existingItem.image.includes('cloudinary')) {
        try {
          const fileName = existingItem.image.split('/').pop().split('.')[0];
          const publicId = existingItem.image.includes('armoire/armoire') 
            ? `armoire/armoire/${fileName}`
            : `armoire/${fileName}`;
          const result = await cloudinaryConfig.cloudinary.uploader.destroy(publicId);
        } catch (cloudinaryError) {
        }
      }
      updateData.image = req.file.path;
    }

    if (!updateData.name && !existingItem.name) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }

    const updatedItem = await Item.findByIdAndUpdate(
      id,
      { $set: updateData },
      {
        new: true,
      },
    );

    if (updateData.categories || updateData.hues || updateData.tags) {
      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: {
          ...(updateData.categories && { categoryBank: { $each: Array.isArray(updateData.categories) 
            ? updateData.categories.map(c => c.trim()) 
            : updateData.categories.split(',').map(c => c.trim()) } }),
          ...(updateData.hues && { hueBank: { $each: Array.isArray(updateData.hues) 
            ? updateData.hues.map(h => h.trim()) 
            : updateData.hues.split(',').map(h => h.trim()) } }),
          ...(updateData.tags && { tagBank: { $each: Array.isArray(updateData.tags) 
            ? updateData.tags.map(t => t.trim()) 
            : updateData.tags.split(',').map(t => t.trim()) } })
        }
      });
    }

    res.status(200).json({ success: true, data: updatedItem });
  } catch (error) {
    console.log('Failed to update item:', error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const deleteItem = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: 'Invalid Item Id' });
  }

  try {
    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    if (item.image && item.image.includes('cloudinary')) {
      try {
        console.log('DELETE - Existing image URL:', item.image);  // Added log
        const publicId = `armoire/${item.image.split('/').pop().split('.')[0]}`;
        console.log('DELETE - Constructed publicId:', publicId);  // Added log
        
        const result = await cloudinaryConfig.cloudinary.uploader.destroy(publicId);
        console.log('DELETE - Cloudinary delete response:', result);  // Added log
      } catch (cloudinaryError) {
        console.error('Error deleting from Cloudinary:', cloudinaryError);
      }
    }

    await Item.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: 'Item deleted' });
  } catch (error) {
    console.log('error in deleting item:', error.message);
    res.status(500).json({ success: false, message: 'Item not found' });
  }
};
