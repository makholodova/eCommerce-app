import type { LineItem } from "@commercetools/platform-sdk";

export interface AuthFields {
  email: string;
  password: string;
}

export interface PersonalInfoFields {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

export interface AddressFormFields {
  streetName: string;
  city: string;
  country: string;
  postalCode: string;
}

export interface CountryOption {
  title: string;
  value: string;
}

export interface ProductAttribute {
  brand?: string;
  model?: string;
  color?: string;
  screen?: string;
  ram?: string;
  rom?: string;
  cores?: number;
  wattage?: string;
  weight?: string;
}

export interface ProductAdapter {
  id: string;
  title: string;
  description: string;
  images: string[];
  price: number | null;
  discountedPrice: number | null;
  discountedPercentage: number | null;
  attributes: ProductAttribute;
}

export interface UserFormModel {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
}

export interface ShoppingCartItem {
  productId: string;
  quantity: number;
  productData: {
    title: string;
    description?: string;
    image?: string;
    price?: number;
    discountedPrice?: number;
    discountedPercentage?: number;
  };
}

interface IncludedDiscount {
  discountedAmount: {
    centAmount: number;
  };
}

export interface ExtendedLineItem extends LineItem {
  discountedPrice?: {
    includedDiscounts?: IncludedDiscount[];
  };
}

export interface PromocodeData {
  code: string;
  discountPercent: number;
  description: string;
  appliesTo: "all" | "category";
}

export const promocodeDictionary: Record<string, PromocodeData> = {
  ZHMT15OFF: {
    code: "ZHMT15OFF",
    discountPercent: 15,
    description: "15% на все товары",
    appliesTo: "all",
  },
  ZHMT20: {
    code: "ZHMT20",
    discountPercent: 20,
    description: "20% на ноутбуки",
    appliesTo: "category",
  },
};
