export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  inventory: number;
  featured?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface SiteSettings {
  bannerUrl: string;
}
