interface Address {
  streetName: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface UserRegistrationData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  addresses: Address[];
  defaultShippingAddress: number | undefined;
  defaultBillingAddress: number | undefined;
  shippingAddresses: number[];
  billingAddresses: number[];
}
export interface RegisterRequest {
  body: UserRegistrationData;
}
