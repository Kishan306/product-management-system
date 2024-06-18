export interface Product {
    id: string;
    name: string;
    imageUrl: string; // Download URL of the product image in Firebase Storage
    price: number;
    discount?: number;
    totalstock: number;
    description: string;
    rating?: number;
}