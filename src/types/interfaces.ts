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
