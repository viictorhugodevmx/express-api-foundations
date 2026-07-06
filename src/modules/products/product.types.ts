export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  active: boolean;
  createdAt: string;
}

export interface CreateProductInput {
  name: string;
  category: string;
  price: number;
  stock: number;
}
