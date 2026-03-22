export interface PriceBreakdown {
  consumerPrice: number;
  pointShare: number;
  platformShare: number;
  supplierShare: number;
}

export function calculateConsumerPrice(
  supplierPrice: number,
  pointCommission: number,
  platformCommission: number
): PriceBreakdown {
  const pointShare = supplierPrice * (pointCommission / 100);
  const platformShare = supplierPrice * (platformCommission / 100);
  const consumerPrice = supplierPrice + pointShare + platformShare;

  return {
    consumerPrice: Math.round(consumerPrice * 100) / 100,
    pointShare: Math.round(pointShare * 100) / 100,
    platformShare: Math.round(platformShare * 100) / 100,
    supplierShare: Math.round(supplierPrice * 100) / 100,
  };
}
