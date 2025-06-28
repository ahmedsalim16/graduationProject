import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageStorageServiceService {

 private readonly STORAGE_KEY_PREFIX = 'admin_image_';
  private readonly DEFAULT_IMAGE = '../../assets/profile.png';
  
  // Subject لتتبع تغييرات الصور
  private imageUpdatedSubject = new BehaviorSubject<{adminId: string, imageUrl: string | null}>({adminId: '', imageUrl: null});
  public imageUpdated$ = this.imageUpdatedSubject.asObservable();

  constructor() {}

  /**
   * حفظ صورة الأدمن في localStorage
   * @param adminId معرف الأدمن
   * @param imageBase64 الصورة بصيغة base64
   */
  setAdminImage(adminId: string, imageBase64: string): void {
    if (!adminId) return;
    
    const storageKey = this.STORAGE_KEY_PREFIX + adminId;
    localStorage.setItem(storageKey, imageBase64);
    
    // إشعار جميع المكونات بالتحديث
    this.imageUpdatedSubject.next({adminId, imageUrl: imageBase64});
  }

  /**
   * الحصول على صورة الأدمن من localStorage
   * @param adminId معرف الأدمن
   * @returns رابط الصورة أو null إذا لم توجد
   */
  getAdminImage(adminId: string): string | null {
    if (!adminId) return null;
    
    const storageKey = this.STORAGE_KEY_PREFIX + adminId;
    return localStorage.getItem(storageKey);
  }

  /**
   * الحصول على صورة الأدمن أو الصورة الافتراضية
   * @param adminId معرف الأدمن
   * @returns رابط الصورة
   */
  getAdminImageOrDefault(adminId: string): string {
    const savedImage = this.getAdminImage(adminId);
    return savedImage || this.DEFAULT_IMAGE;
  }

  /**
   * إزالة صورة الأدمن
   * @param adminId معرف الأدمن
   */
  removeAdminImage(adminId: string): void {
    if (!adminId) return;
    
    const storageKey = this.STORAGE_KEY_PREFIX + adminId;
    localStorage.removeItem(storageKey);
    
    // إشعار جميع المكونات بالإزالة
    this.imageUpdatedSubject.next({adminId, imageUrl: null});
  }

  /**
   * الحصول على جميع صور الأدمن المحفوظة
   * @returns كائن يحتوي على معرفات الأدمن وصورهم
   */
  getAllAdminImages(): {[adminId: string]: string} {
    const adminImages: {[adminId: string]: string} = {};
    
    // البحث في localStorage عن جميع الصور
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.STORAGE_KEY_PREFIX)) {
        const adminId = key.replace(this.STORAGE_KEY_PREFIX, '');
        const imageData = localStorage.getItem(key);
        if (imageData) {
          adminImages[adminId] = imageData;
        }
      }
    }
    
    return adminImages;
  }

  /**
   * مسح جميع صور الأدمن
   */
  clearAllAdminImages(): void {
    const keysToRemove: string[] = [];
    
    // جمع جميع المفاتيح المراد حذفها
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.STORAGE_KEY_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    
    // حذف المفاتيح
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // إشعار بالمسح الكامل
    this.imageUpdatedSubject.next({adminId: 'ALL_CLEARED', imageUrl: null});
  }

  /**
   * التحقق من وجود صورة للأدمن
   * @param adminId معرف الأدمن
   * @returns true إذا كانت توجد صورة مخصصة
   */
  hasCustomImage(adminId: string): boolean {
    return this.getAdminImage(adminId) !== null;
  }

  /**
   * الحصول على عدد الصور المحفوظة
   * @returns عدد صور الأدمن المحفوظة
   */
  getStoredImagesCount(): number {
    let count = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.STORAGE_KEY_PREFIX)) {
        count++;
      }
    }
    return count;
  }

  /**
   * الحصول على معرف الأدمن الحالي من localStorage أو من أي مصدر آخر
   * @returns معرف الأدمن الحالي
   */
  getCurrentAdminId(): string | null {
    // يمكنك تخصيص هذه الدالة حسب طريقة تخزين معرف الأدمن الحالي
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      try {
        const userData = JSON.parse(currentUser);
        return userData.id || userData.adminId || null;
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * الحصول على صورة الأدمن الحالي
   * @returns رابط صورة الأدمن الحالي
   */
  getCurrentAdminImage(): string {
    const currentAdminId = this.getCurrentAdminId();
    return currentAdminId ? this.getAdminImageOrDefault(currentAdminId) : this.DEFAULT_IMAGE;
  }
}
