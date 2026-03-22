// TODO: Integrate with 019 SMS gateway for production OTP delivery

export function generateOTP(): string {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
}

export async function sendSMS(
  phone: string,
  message: string
): Promise<boolean> {
  // TODO: Replace with actual 019 SMS API integration
  console.log(`[SMS] To: ${phone}`);
  console.log(`[SMS] Message: ${message}`);
  return true;
}
