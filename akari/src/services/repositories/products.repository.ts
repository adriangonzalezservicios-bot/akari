import { collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { Product } from '../../types';
const products = collection(db, 'products');
export const productsRepository = {
  async list(): Promise<Product[]> { const snapshot = await getDocs(products); return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as Product); },
  save(product: Product) { return setDoc(doc(db, 'products', product.id), product); },
  remove(id: string) { return deleteDoc(doc(db, 'products', id)); },
};
