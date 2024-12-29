import Item from '../models/item.model.js';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';

export const getItems = async (req, res) => {
  try {
    // req.user._id comes from your auth middleware
    const items = await Item.find({ user: req.user._id });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './backend/uploads'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage }).single('image');

export const createItem = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'File upload error' });
    }

    const { name, categories, hues, tags, sellvalue } = req.body;
    const userId = new mongoose.Types.ObjectId(req.user._id);

    if (!name || !req.file) {
      return res.status(400).json({ success: false, message: 'Please provide all fields' });
    }
    try {
      const newItem = new Item({
        name,
        categories: categories ? categories.split(',') : [],
        hues: hues ? hues.split(',') : [],
        tags: tags ? tags.split(',') : [],
        sellvalue,
        image: req.file.filename,
        user: userId,
      });

      const savedItem = await newItem.save();
      res.status(201).json({ success: true, data: newItem });
    } catch (error) {
      console.error('Error in Create Item:', error.message);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  });
};

export const updateItem = async (req, res) => {
  const { id } = req.params;
  const item = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: 'Invalid Item Id' });
  }

  try {
    const updatedItem = await Item.findByIdAndUpdate(id, item, {
      new: true,
    });
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
    await Item.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Item deleted' });
  } catch (error) {
    console.log('error in deleting item:', error.message);
    res.status(500).json({ success: false, message: 'Item not found' });
  }
};
