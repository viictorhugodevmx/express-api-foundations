export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  active: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateProductInput {
  name: string;
  category: string;
  price: number;
  stock: number;
}

export interface UpdateProductInput {
  name?: string;
  category?: string;
  price?: number;
  stock?: number;
  active?: boolean;
}
