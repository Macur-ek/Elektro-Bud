import type { Product } from "./product.js";

const STORAGE_KEY = "elektro-bud-products";

/**
 * Odczytuje produkty z localStorage.
 * Jeśli nie ma zapisanych danych albo zapis jest uszkodzony,
 * zwraca przykładowe produkty zamiast przerywać działanie aplikacji.
 */
export function loadProducts(): Product[] {
  const savedData = localStorage.getItem(STORAGE_KEY);

  if (savedData === null) {
    return createInitialProducts();
  }

  try {
    const parsedData: unknown = JSON.parse(savedData);

    if (Array.isArray(parsedData)) {
      return parsedData as Product[];
    }
  } catch {
    
  }

  return createInitialProducts();
}

export function saveProducts(products: Product[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

function createInitialProducts(): Product[] {
  return [
    { id: crypto.randomUUID(), code: "KAB-001", name: "Przewód YDY 3x2,5", category: "Przewody", price: 4.85, quantity: 120, minimumStock: 30 },
    { id: crypto.randomUUID(), code: "OSW-014", name: "Oprawa LED 18 W", category: "Oświetlenie", price: 32.90, quantity: 8, minimumStock: 10 },
    { id: crypto.randomUUID(), code: "ELE-022", name: "Wyłącznik nadprądowy B16", category: "Aparatura", price: 18.50, quantity: 42, minimumStock: 12 },
    { id: crypto.randomUUID(), code: "MON-005", name: "Puszka instalacyjna", category: "Osprzęt", price: 2.40, quantity: 6, minimumStock: 20 }
  ];
}
