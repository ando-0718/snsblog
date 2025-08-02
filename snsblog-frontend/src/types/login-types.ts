export type LoginType = {
  errors?: {
    email?: string[];
    password?: string[];
    server?: string | null;
  }
}