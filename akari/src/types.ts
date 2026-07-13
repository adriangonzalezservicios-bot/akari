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
  logoUrl?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  mercadopagoPublicKey?: string;
  mercadopagoAccessToken?: string;
  mercadopagoAlias?: string;
}
