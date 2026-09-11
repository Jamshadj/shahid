import { supabase, isSupabaseConfigured } from './supabase/client';
import { 
  StoreSettings, 
  Category, 
  MenuItem, 
  Bill, 
  BillItem, 
  BillWithItems, 
  CartItem, 
  PaymentMode, 
  PaymentStatus 
} from '@/types/database';
import { 
  DEFAULT_STORE_SETTINGS, 
  INITIAL_CATEGORIES, 
  INITIAL_MENU_ITEMS, 
  INITIAL_BILLS 
} from './mock-data';

// Helper for LocalStorage fallback persistence
function getStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.warn(`Error reading ${key} from localStorage`, e);
    return defaultValue;
  }
}

function setStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error saving ${key} to localStorage`, e);
  }
}

// ----------------------------------------------------
// 1. STORE SETTINGS
// ----------------------------------------------------
export async function getStoreSettings(): Promise<StoreSettings> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('store_settings').select('*').single();
      if (!error && data) return data as StoreSettings;
    } catch (err) {
      console.warn('Supabase fetch store settings failed, falling back to local state:', err);
    }
  }
  return getStorage('store_settings', DEFAULT_STORE_SETTINGS);
}

export async function updateStoreSettings(settings: Partial<StoreSettings>): Promise<StoreSettings> {
  const current = await getStoreSettings();
  const updated: StoreSettings = { ...current, ...settings, updated_at: new Date().toISOString() };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('store_settings')
        .update(settings)
        .eq('id', current.id)
        .select()
        .single();
      if (!error && data) return data as StoreSettings;
    } catch (err) {
      console.warn('Supabase update store settings failed:', err);
    }
  }

  setStorage('store_settings', updated);
  return updated;
}

// ----------------------------------------------------
// 2. CATEGORIES
// ----------------------------------------------------
export async function getCategories(): Promise<Category[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('categories').select('*').order('display_order', { ascending: true });
      if (!error && data && data.length > 0) return data as Category[];
    } catch (err) {
      console.warn('Supabase categories fetch failed:', err);
    }
  }
  return getStorage('categories', INITIAL_CATEGORIES);
}

export async function createCategory(name: string): Promise<Category> {
  const categories = await getCategories();
  const newCat: Category = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `cat-${Date.now()}`,
    name,
    display_order: categories.length + 1,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('categories').insert([{ name, display_order: newCat.display_order }]).select().single();
      if (!error && data) return data as Category;
    } catch (err) {
      console.warn('Supabase create category failed:', err);
    }
  }

  const updatedList = [...categories, newCat];
  setStorage('categories', updatedList);
  return newCat;
}

export async function deleteCategory(id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('categories').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase delete category failed:', err);
    }
  }

  const categories = await getCategories();
  const updatedList = categories.filter((c) => c.id !== id);
  setStorage('categories', updatedList);
}

// ----------------------------------------------------
// 3. MENU ITEMS
// ----------------------------------------------------
export async function getMenuItems(): Promise<MenuItem[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('menu_items').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data as MenuItem[];
    } catch (err) {
      console.warn('Supabase menu_items fetch failed:', err);
    }
  }
  return getStorage('menu_items', INITIAL_MENU_ITEMS);
}

export async function saveMenuItem(item: Omit<MenuItem, 'id' | 'created_at'> & { id?: string }): Promise<MenuItem> {
  const items = await getMenuItems();
  const isEdit = Boolean(item.id);
  const id = item.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `item-${Date.now()}`);
  
  const savedItem: MenuItem = {
    id,
    category_id: item.category_id,
    name: item.name,
    description: item.description,
    price: Number(item.price),
    image_url: item.image_url,
    is_available: item.is_available ?? true,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      if (isEdit) {
        const { data, error } = await supabase.from('menu_items').update(savedItem).eq('id', id).select().single();
        if (!error && data) return data as MenuItem;
      } else {
        const { data, error } = await supabase.from('menu_items').insert([savedItem]).select().single();
        if (!error && data) return data as MenuItem;
      }
    } catch (err) {
      console.warn('Supabase save menu_item failed:', err);
    }
  }

  let updatedList: MenuItem[];
  if (isEdit) {
    updatedList = items.map((i) => (i.id === id ? savedItem : i));
  } else {
    updatedList = [savedItem, ...items];
  }
  setStorage('menu_items', updatedList);
  return savedItem;
}

export async function toggleMenuItemAvailability(id: string, is_available: boolean): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('menu_items').update({ is_available }).eq('id', id);
    } catch (err) {
      console.warn('Supabase toggle availability failed:', err);
    }
  }

  const items = await getMenuItems();
  const updated = items.map((i) => (i.id === id ? { ...i, is_available } : i));
  setStorage('menu_items', updated);
}

export async function deleteMenuItem(id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('menu_items').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase delete item failed:', err);
    }
  }

  const items = await getMenuItems();
  const updatedList = items.filter((i) => i.id !== id);
  setStorage('menu_items', updatedList);
}

// ----------------------------------------------------
// 4. BILLS & BILL ITEMS
// ----------------------------------------------------
export async function getBills(): Promise<BillWithItems[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('bills')
        .select('*, bill_items(*)')
        .order('created_at', { ascending: false });
      if (!error && data) return data as BillWithItems[];
    } catch (err) {
      console.warn('Supabase getBills failed:', err);
    }
  }
  return getStorage('bills', INITIAL_BILLS);
}

export async function getBillById(id: string): Promise<BillWithItems | null> {
  const bills = await getBills();
  return bills.find((b) => b.id === id || String(b.bill_number) === id) || null;
}

export async function createBill(params: {
  customer_name?: string;
  customer_phone?: string;
  cartItems: CartItem[];
  discount_amount: number;
  tax_rate_percent: number;
  payment_mode: PaymentMode;
  payment_status: PaymentStatus;
}): Promise<BillWithItems> {
  const bills = await getBills();
  const nextBillNum = bills.length > 0 ? Math.max(...bills.map((b) => b.bill_number)) + 1 : 1001;

  const subtotal = params.cartItems.reduce(
    (sum, ci) => sum + (ci.customPrice ?? ci.menuItem.price) * ci.quantity,
    0
  );
  
  const taxableAmount = Math.max(0, subtotal - params.discount_amount);
  const tax_amount = Math.round((taxableAmount * (params.tax_rate_percent / 100)) * 100) / 100;
  const grand_total = Math.round((taxableAmount + tax_amount) * 100) / 100;

  const billId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `bill-${Date.now()}`;

  const newBill: Bill = {
    id: billId,
    bill_number: nextBillNum,
    customer_name: params.customer_name || 'Walk-in Customer',
    customer_phone: params.customer_phone || '',
    subtotal,
    discount_amount: params.discount_amount,
    tax_amount,
    grand_total,
    payment_mode: params.payment_mode,
    payment_status: params.payment_status,
    created_at: new Date().toISOString(),
  };

  const lineItems: BillItem[] = params.cartItems.map((ci, index) => {
    const unit_price = ci.customPrice ?? ci.menuItem.price;
    return {
      id: `bi-${billId}-${index}`,
      bill_id: billId,
      item_id: ci.menuItem.id,
      item_name: ci.menuItem.name,
      unit_price,
      quantity: ci.quantity,
      total_price: unit_price * ci.quantity,
    };
  });

  const fullBill: BillWithItems = {
    ...newBill,
    bill_items: lineItems,
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data: dbBill, error: billErr } = await supabase
        .from('bills')
        .insert([{
          customer_name: newBill.customer_name,
          customer_phone: newBill.customer_phone,
          subtotal: newBill.subtotal,
          discount_amount: newBill.discount_amount,
          tax_amount: newBill.tax_amount,
          grand_total: newBill.grand_total,
          payment_mode: newBill.payment_mode,
          payment_status: newBill.payment_status,
        }])
        .select()
        .single();

      if (!billErr && dbBill) {
        const dbItemsToInsert = lineItems.map((item) => ({
          bill_id: dbBill.id,
          item_id: item.item_id,
          item_name: item.item_name,
          unit_price: item.unit_price,
          quantity: item.quantity,
          total_price: item.total_price,
        }));

        const { data: dbItems } = await supabase
          .from('bill_items')
          .insert(dbItemsToInsert)
          .select();

        return {
          ...dbBill,
          bill_items: dbItems || lineItems,
        };
      }
    } catch (err) {
      console.warn('Supabase create bill failed:', err);
    }
  }

  const updatedBills = [fullBill, ...bills];
  setStorage('bills', updatedBills);
  return fullBill;
}

export async function updateBillPaymentStatus(billId: string, status: PaymentStatus): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('bills').update({ payment_status: status }).eq('id', billId);
    } catch (err) {
      console.warn('Supabase update bill status failed:', err);
    }
  }

  const bills = await getBills();
  const updated = bills.map((b) => (b.id === billId ? { ...b, payment_status: status } : b));
  setStorage('bills', updated);
}

export async function deleteBill(billId: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('bill_items').delete().eq('bill_id', billId);
      await supabase.from('bills').delete().eq('id', billId);
    } catch (err) {
      console.warn('Supabase delete bill failed:', err);
    }
  }

  const bills = await getBills();
  const updated = bills.filter((b) => b.id !== billId);
  setStorage('bills', updated);
}

export async function deleteBills(billIds: string[]): Promise<void> {
  if (billIds.length === 0) return;

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('bill_items').delete().in('bill_id', billIds);
      await supabase.from('bills').delete().in('id', billIds);
    } catch (err) {
      console.warn('Supabase delete bills failed:', err);
    }
  }

  const bills = await getBills();
  const updated = bills.filter((b) => !billIds.includes(b.id));
  setStorage('bills', updated);
}

export async function deleteAllBills(): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('bill_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('bills').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    } catch (err) {
      console.warn('Supabase delete all bills failed:', err);
    }
  }

  setStorage('bills', []);
}
