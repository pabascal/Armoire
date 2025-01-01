import Item from '../models/item.model.js';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import cloudinaryConfig from '../config/cloudinary.js';

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

export const createItem = async (req, res) => {
  try {
    const { name, categories, hues, tags, sellvalue } = req.body;
    const userId = req.user._id;

    if (!name || !req.file) {
      return res.status(400).json({ success: false, message: 'Please provide all fields' });
    }
    const newItem = new Item({
      name,
      categories: categories ? categories.split(',') : [],
      hues: hues ? hues.split(',') : [],
      tags: tags ? tags.split(',') : [],
      sellvalue,
      image: req.file.path,
      user: userId,
    });

    const savedItem = await newItem.save();
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
          // Check if URL contains double armoire and construct publicId accordingly
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
