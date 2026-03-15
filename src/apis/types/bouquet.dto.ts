export interface BouquetCategory {
  id: number;
  name: string;
  description: string;
}

export interface Bouquet {
  id: number;
  name: string;
  price: number;
  status: number;
  description: string;
  category: BouquetCategory | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  images: BouquetImage[];
  bouquetsMaterials: BouquetMaterial[];
}

export interface BouquetImage {
  id: number;
  bouquetId: number;
  image: string;
  publicId?: string;
}

export interface BouquetMaterial {
  id: number;
  bouquetId: number;
  materialId: number;
  quantity: number;
  rawMaterialName: string;
}