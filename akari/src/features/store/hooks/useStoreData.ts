import { useQuery } from '@tanstack/react-query';
import { initialProducts } from '../../../data';
import { productsRepository } from '../../../services/repositories/products.repository';
import { settingsRepository } from '../../../services/repositories/settings.repository';
import type { SiteSettings } from '../../../types';
const emptySettings: SiteSettings = { bannerUrl: '', logoUrl: '', heroTitle: '', heroSubtitle: '', contactEmail: '', contactPhone: '', contactAddress: '' };
export function useStoreData() {
  const products = useQuery({ queryKey: ['products'], queryFn: async () => { const data = await productsRepository.list(); return data.length ? data : initialProducts; }, placeholderData: initialProducts });
  const settings = useQuery({ queryKey: ['settings', 'global'], queryFn: async () => (await settingsRepository.get('global')) ?? emptySettings, placeholderData: emptySettings });
  return { products, settings };
}
