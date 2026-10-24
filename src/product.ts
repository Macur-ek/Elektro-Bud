/**
 * Opis pojedynczego produktu magazynowego.
 * Interfejs określa, jakie pola musi mieć każdy produkt.
 */
export interface Product {
  id: string;
  code: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  minimumStock: number;
}

export type ProductInput = Omit<Product, "id">;
