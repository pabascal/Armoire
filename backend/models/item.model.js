import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    categories: [{ type: String }],
    hues: [{ type: String }],
    tags: [{ type: String }],
    sellvalue: { type: Number },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true,
  },
);

const Item = mongoose.model('Item', itemSchema);

export default Item;
