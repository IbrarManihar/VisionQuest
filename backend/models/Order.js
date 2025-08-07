import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() {
      return !this.isAnonymous;
    }
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  userName: {
    type: String,
    required: true
  },
  userSemester: String,
  userBranch: String,
  contactNumber: String,
  shippingAddress: String,
  orderDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  },
  deliveryStatus: {
    type: String,
    enum: ['processing', 'shipped', 'delivered'],
    default: 'processing'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'razorpay', 'upi', 'other'],
    default: 'cash'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  transactionId: String,
  buyerNotes: String,
  sellerNotes: String,
  cancellationReason: String,
  cancelledAt: Date,
  updatedAt: Date
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;
