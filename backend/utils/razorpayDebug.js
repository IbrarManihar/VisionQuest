import Razorpay from 'razorpay';

export const verifyRazorpayCredentials = async () => {
  console.log('Verifying Razorpay credentials...');
  
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.error('❌ Razorpay credentials are missing in environment variables');
    return false;
  }
  
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    await razorpay.payments.all({ count: 1 });
    
    console.log('✅ Razorpay credentials verified successfully');
    return true;
  } catch (error) {
    console.error('❌ Razorpay credentials verification failed:', error.message);
    return false;
  }
};
