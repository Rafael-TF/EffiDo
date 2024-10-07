const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  verificationTokenExpires: Date,
  avatarUrl: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  // Nuevos campos para estadísticas
  totalTasks: { type: Number, default: 0 },
  completedTasks: { type: Number, default: 0 },
  taskCompletionRate: { type: Number, default: 0 },
  productivityScore: { type: Number, default: 0 },
  streakDays: { type: Number, default: 0 },
  weeklyProductivity: [{
    day: String,
    score: Number
  }]
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutos
  return resetToken;
};

module.exports = mongoose.model('User', userSchema);