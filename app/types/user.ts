export interface UserAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface User {
  id: number | string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: UserAddress;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export type SignInErrors = Partial<Record<keyof SignInCredentials, string>>;

export type SignUpErrors = Partial<Record<keyof SignUpData, string>>;
