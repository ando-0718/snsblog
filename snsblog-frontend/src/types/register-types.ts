export type RegisterType = {
  errors?: {
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
    server?: string | null;
  }
}