export interface User {
    id?: string;
    name: string;
    login: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date | null;
  }