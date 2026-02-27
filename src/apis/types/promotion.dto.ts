export interface Promotion {
  id: number;
  name: string;
  code: string;
  description: string;
  discountValue: number;
  startDate: string;
  endDate: string;
  minOrderValue: number;
  maxDiscountValue: number;
}