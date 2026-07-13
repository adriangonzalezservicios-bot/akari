import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { SiteSettings } from '../../types';
const ref = (id: 'global' | 'main') => doc(db, 'settings', id);
export const settingsRepository = {
  async get(id: 'global' | 'main' = 'global'): Promise<SiteSettings | null> { const snapshot = await getDoc(ref(id)); return snapshot.exists() ? snapshot.data() as SiteSettings : null; },
  save(settings: SiteSettings, id: 'global' | 'main' = 'main') { return setDoc(ref(id), settings); },
};
