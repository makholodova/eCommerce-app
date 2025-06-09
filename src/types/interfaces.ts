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
    images?: string;
    price?: number;
    discountedPrice?: number;
    discountedPercentage?: number;
  };
}
