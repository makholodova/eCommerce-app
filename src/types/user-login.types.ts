export interface UserLoginData {
  email: string;
  password: string;
}
export interface LoginRequest {
  body: UserLoginData;
}
