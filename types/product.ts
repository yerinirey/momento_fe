export interface Product {
  id: number;
  name: string;
  amountInStock: number;
  currentPrice: number;
  previousPrice: number;
  deliveryPrice: number;
  deliveryInDays: number;
  isAmazonChoice: boolean;
  imageUrl?: string | null;
  model3DUrl?: string | null;
}
