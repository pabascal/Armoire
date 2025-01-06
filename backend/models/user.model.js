import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, },
    email: { type: String, required: true, unique: true, match: [/\S+@\S+\.\S+/, 'Please use a valid email address'], },  //conventional match validation string for correctness & uniqueness of email screening
    password: { type: String, required: true },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item', }],  //the ref Item choose Items as what we want to match to users, update as needed
    categoryBank: [String],
    hueBank: [String],
    tagBank: [String]
  },
  {
    timestamps: true,
  },
);

//pre-save hook:
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {return next();} // only hash if password is being modified
    const salt = await bcrypt.genSalt(10); // generate salt
    this.password = await bcrypt.hash(this.password, salt); // hash password
    next();
});

// Compare the entered password with the hashed password
userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password); // compare entered password with hashed password
  };

const User = mongoose.model('User', userSchema);

export default User;
