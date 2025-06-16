export interface UserLoginData {
  email: string;
  password: string;
}
export interface LoginRequest {
  body: UserLoginData;
}

export type breadCrumbType = {
  routeName:
    | "Main"
    | "Catalog"
    | "CatalogCategory"
    | "Product"
    | "User"
    | "Register"
    | "Login";
  breadcrumbName: string;
  params?: Record<string, string>;
};
