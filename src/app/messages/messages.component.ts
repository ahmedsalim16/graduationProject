import { Component, Inject, NgModule, OnInit, ViewChild,ElementRef } from '@angular/core';
import { SignalRService } from '../services/signalr.service';
import { AuthService } from '../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { SharedService } from '../services/shared.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { Sidebar, SidebarModule } from 'primeng/sidebar';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { EditorModule } from 'primeng/editor';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
// import { Editor, EditorModule } from 'primeng/editor';
import { Subscription } from 'rxjs';
import { ThemeService } from '../services/theme.service'; // استيراد خدمة الثيم
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component'; 
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).default.vfs = (pdfFonts as any).vfs;
// import Quill from 'quill';
// import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';
import { TranslateModule } from '@ngx-translate/core';
import { ImageStorageServiceService } from '../services/image-storage-service.service';
// import { LanguageService } from '../services/language.service';
@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: [
    './messages.component.css',
    '../../../node_modules/quill/dist/quill.snow.css',
    '../../../node_modules/quill/dist/quill.core.css'
  ],
  standalone:true,
  imports: [FormsModule, RouterModule, CommonModule, SidebarModule, ThemeToggleComponent,ButtonModule,EditorModule,RippleModule],
  providers:[],
  template: `<div #editorContainer></div>`
})

export class MessagesComponent implements OnInit{
      @ViewChild('sidebarRef') sidebarRef!: Sidebar;
      // @ViewChild('editor') editor!: Editor;
      // @ViewChild('editorContainer', { static: true }) editorContainer!: ElementRef;
  // private quill!: Quill;
          isRtl: boolean = false;
      sidebarVisible: boolean = false;
  emailData = {
    toEmail: '',
    subject: '',
    body: ''
  };
    messages: any[] = [];
    adminId: string | null = null;
  adminName:string | null = localStorage.getItem('username');
  schoolName:string | null = localStorage.getItem('schoolTenantId');
  private subscriptions: Subscription = new Subscription();
  




    constructor(public authService:AuthService, private router: Router, private shared:SharedService,private adminImageService: ImageStorageServiceService,) {}
    ngOnInit(): void {
      
    // this.isRtl = this.languageService.isRtl();
      if (!this.authService.isLoggedIn()) {
        this.router.navigate(['/login']);
        return;
      }
  
      this.adminId = this.authService.getAdminId();
      console.log('Admin ID:', this.adminId);
      this.schoolLogo();
  
      if (window.innerWidth < 768) {
        this.sidebarVisible = false;
      }
      
      window.addEventListener('resize', this.handleResize);
    }
   // الحصول على صورة الأدمن
  getAdminImage(adminId: string): string {
    return this.adminImageService.getAdminImageOrDefault(adminId);
  }

  // التحقق من وجود صورة مخصصة
  hasCustomImage(adminId: string): boolean {
    return this.adminImageService.hasCustomImage(adminId);
  }


    ngOnDestroy(): void {
      window.removeEventListener('resize', this.handleResize);
      this.subscriptions.unsubscribe();
    }
  
    private handleResize = () => {
      if (window.innerWidth < 768) {
        this.sidebarVisible = false;
      }
    }
     private stripHtml(html: string): string {
    if (!html) return '';
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    return tempDiv.textContent || tempDiv.innerText || '';
  }
  
  // إضافة دعم تغيير الخط في المحرر
ngAfterViewInit() {
  // الانتظار قليلاً للتأكد من تهيئة محرر Quill
  setTimeout(() => {
    try {
      // الحصول على محرر Quill
      const quillEditor = (document.querySelector('.ql-editor') as any)?.['__quill'];
      if (quillEditor) {
        // إضافة مستمع لتغيير الخط
        quillEditor.on('text-change', () => {
          // التحقق من تحديد نص
          const format = quillEditor?.getFormat();
          console.log('Current format:', format);
          
          // تحديث نمط الخط المختار إذا وجد
          if (format && format.font) {
            // تطبيق الخط على العنصر المحدد
            document.querySelectorAll('.ql-font.ql-picker .ql-picker-item').forEach((item: any) => {
              if (item.getAttribute('data-value') === format.font) {
                item.classList.add('ql-selected');
              } else {
                item.classList.remove('ql-selected');
              }
            });
          }
        });
        
        // إضافة دعم الخطوط المخصصة
        this.setupCustomFonts(quillEditor);
      }
    } catch (error) {
      console.error('Error setting up Quill editor:', error);
    }
  }, 500);
}
private updateFontPickerStyles(): void {
  try {
    // تعريف الخطوط المتاحة في التطبيق
    const availableFonts = [
      { value: 'arial', name: 'Arial', family: 'Arial, sans-serif' },
      { value: 'calibri', name: 'Calibri', family: 'Calibri, sans-serif' },
      { value: 'comic-sans', name: 'Comic Sans', family: 'Comic Sans MS, cursive' },
      { value: 'courier-new', name: 'Courier New', family: 'Courier New, Courier, monospace' },
      { value: 'georgia', name: 'Georgia', family: 'Georgia, serif' },
      { value: 'helvetica', name: 'Helvetica', family: 'Helvetica, Arial, sans-serif' },
      { value: 'lucida', name: 'Lucida Sans', family: 'Lucida Sans Unicode, Lucida Grande, sans-serif' },
      { value: 'tahoma', name: 'Tahoma', family: 'Tahoma, Geneva, sans-serif' },
      { value: 'times-new-roman', name: 'Times New Roman', family: 'Times New Roman, Times, serif' },
      { value: 'verdana', name: 'Verdana', family: 'Verdana, Geneva, sans-serif' },
      { value: 'roboto', name: 'Roboto', family: 'Roboto, sans-serif' },
      // خطوط عربية
      { value: 'cairo', name: 'Cairo', family: 'Cairo, sans-serif' },
      { value: 'tajawal', name: 'Tajawal', family: 'Tajawal, sans-serif' },
      { value: 'scheherazade', name: 'Scheherazade', family: 'Scheherazade, serif' },
      { value: 'amiri', name: 'Amiri', family: 'Amiri, serif' }
    ];

    // الحصول على قائمة الخطوط من واجهة المستخدم
    const fontPicker = document.querySelector('.ql-font.ql-picker');
    if (!fontPicker) {
      console.warn('لم يتم العثور على قائمة اختيار الخطوط');
      return;
    }

    // الحصول على اللافتة والخيارات
    const fontPickerLabel = fontPicker.querySelector('.ql-picker-label');
    const fontPickerOptions = fontPicker.querySelector('.ql-picker-options');
    
    if (!fontPickerLabel || !fontPickerOptions) {
      console.warn('لم يتم العثور على عناصر قائمة اختيار الخطوط');
      return;
    }

    // تنظيف الخيارات الحالية
    fontPickerOptions.innerHTML = '';

    // إضافة الخطوط المتاحة إلى القائمة
    availableFonts.forEach(font => {
      // إنشاء عنصر خيار جديد
      const item = document.createElement('span');
      item.className = 'ql-picker-item';
      item.setAttribute('data-value', font.value);
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.setAttribute('aria-label', font.name);
      
      // تطبيق نمط الخط على العنصر نفسه
      item.style.fontFamily = font.family;
      
      // إضافة اسم الخط كنص داخل العنصر
      item.textContent = font.name;
      
      // إضافة الخيار إلى قائمة الخيارات
      fontPickerOptions.appendChild(item);
    });

    // تحديث نص العنوان الافتراضي
    if (fontPickerLabel) {
      const defaultFont = availableFonts[0]; // اختيار الخط الأول كافتراضي
      fontPickerLabel.setAttribute('data-value', defaultFont.value);
      
      // تطبيق نمط الخط على العنوان
      const valueLabel = fontPickerLabel.querySelector('.ql-picker-label-value');
      if (valueLabel) {
        valueLabel.textContent = defaultFont.name;
        (valueLabel as HTMLElement).style.fontFamily = defaultFont.family;
      } else {
        // إنشاء عنصر جديد لعرض الخط المختار
        const newValueLabel = document.createElement('span');
        newValueLabel.className = 'ql-picker-label-value';
        newValueLabel.textContent = defaultFont.name;
        newValueLabel.style.fontFamily = defaultFont.family;
        fontPickerLabel.appendChild(newValueLabel);
      }
    }

    // إضافة أنماط CSS للقائمة لتحسين المظهر
    this.addFontPickerStyles();
    
    console.log('تم تحديث قائمة الخطوط بنجاح');
  } catch (error) {
    console.error('خطأ أثناء تحديث مظهر قائمة الخطوط:', error);
  }
}
private addFontPickerStyles(): void {
  try {
    // التحقق من وجود عنصر الأنماط
    let styleElement = document.getElementById('quill-font-picker-styles');
    
    // إنشاء عنصر جديد إذا لم يكن موجودًا
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'quill-font-picker-styles';
      document.head.appendChild(styleElement);
    }
    
    // تعريف الأنماط CSS
    const styles = `
      .ql-font.ql-picker {
        min-width: 120px;
      }
      
      .ql-font .ql-picker-options {
        max-height: 200px;
        overflow-y: auto;
        padding: 5px 0;
      }
      
      .ql-font .ql-picker-item {
        display: block;
        padding: 5px 15px;
        cursor: pointer;
        transition: background-color 0.2s;
        text-align: left;
      }
      
      .ql-font .ql-picker-item:hover {
        background-color: #f0f0f0;
      }
      
      .ql-font .ql-picker-item.ql-selected {
        background-color: #e8e8e8;
        font-weight: bold;
      }
      
      .ql-font .ql-picker-label {
        display: flex;
        align-items: center;
        padding: 0 10px;
      }
      
      .ql-font .ql-picker-label::before {
        content: "Font";
        margin-right: 5px;
      }
      
      .ql-font .ql-picker-label-value {
        flex-grow: 1;
        text-align: left;
        padding-left: 5px;
      }
      
      /* تعديلات لدعم RTL */
      [dir="rtl"] .ql-font .ql-picker-item {
        text-align: right;
      }
      
      [dir="rtl"] .ql-font .ql-picker-label::before {
        content: "خط";
        margin-left: 5px;
        margin-right: 0;
      }
      
      [dir="rtl"] .ql-font .ql-picker-label-value {
        text-align: right;
        padding-right: 5px;
        padding-left: 0;
      }
    `;
    
    // تطبيق الأنماط
    styleElement.textContent = styles;
    
    console.log('تم إضافة أنماط CSS لقائمة الخطوط');
  } catch (error) {
    console.error('خطأ أثناء إضافة أنماط CSS لقائمة الخطوط:', error);
  }
}

// إعداد الخطوط المخصصة في محرر Quill
private setupCustomFonts(quillEditor: any) {
  if (!quillEditor) return;
  
  try {
    // تعريف الخطوط المتاحة (يجب أن تكون متوافقة مع الخطوط المعرفة في HTML)
    const fontAttributor = quillEditor.root.ownerDocument.querySelector('.ql-font');
    if (fontAttributor) {
      // تأكد من تهيئة قائمة الخطوط المخصصة
      const fontSelector = fontAttributor.querySelector('.ql-picker-options');
      if (fontSelector) {
        // تحديث مظهر قائمة الخطوط
        this.updateFontPickerStyles();
        
        // إضافة حدث لتطبيق الخط المحدد فعليًا على المحتوى المكتوب
        fontSelector.addEventListener('click', (event: Event) => {
          const target = event.target as HTMLElement;
          if (target.classList.contains('ql-picker-item')) {
            const fontValue = target.getAttribute('data-value');
            if (fontValue) {
              const range = quillEditor.getSelection();
              if (range) {
                quillEditor.format('font', fontValue);
              }
            }
          }
        });
      }
    }
  } catch (error) {
    console.error('Error setting up custom fonts:', error);
  }
}
// دالة لاستخراج الصور من محتوى HTML
private extractImagesFromHtml(htmlContent: string): Promise<{id: string, data: string}[]> {
  return new Promise((resolve) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const images = doc.querySelectorAll('img');
    const imageInfoArray: {id: string, data: string}[] = [];

    images.forEach((img, index) => {
      const imgSrc = img.getAttribute('src');
      if (imgSrc) {
        // إنشاء معرف فريد للصورة
        const imgId = `img_${index}`;
        img.setAttribute('data-img-id', imgId);
        
        // إذا كانت الصورة بتنسيق base64
        if (imgSrc.startsWith('data:image')) {
          imageInfoArray.push({
            id: imgId,
            data: imgSrc
          });
        } else {
          // محاولة تحميل الصور الخارجية (قد تحتاج إلى معالجة CORS)
          this.getBase64Image(imgSrc).then(base64Data => {
            imageInfoArray.push({
              id: imgId,
              data: base64Data
            });
          }).catch(() => {
            console.warn('Failed to load image:', imgSrc);
          });
        }
      }
    });

    resolve(imageInfoArray);
  });
}

// دالة لتحويل الصور إلى base64
private getBase64Image(src: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // إذا كانت الصورة بالفعل بتنسيق base64
    if (src.startsWith('data:image')) {
      resolve(src);
      return;
    }
    
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject('Could not get canvas context');
        return;
      }
      
      ctx.drawImage(img, 0, 0);
      
      try {
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      } catch (e) {
        reject(e);
      }
    };
    
    img.onerror = () => {
      reject('Error loading image');
    };
    
    img.src = src;
  });
}
// تعديل دالة exportToPdf في MessagesComponent
exportToPdf(): void {
  if (!this.emailData.body) {
    this.showErrorAlert('لا يوجد محتوى لتصديره!');
    return;
  }

  // استخراج الصور من محتوى HTML
  this.extractImagesFromHtml(this.emailData.body).then(imageInfoArray => {
    // تعريف محتوى PDF
    const content: any[] = [
      { text: 'Exported Email', style: 'header' },
      { text: ' ', style: 'spacer' },
      { text: new Date().toLocaleString(), alignment: 'left' },
      { text: ' ', style: 'spacer' },
      { text: 'Email: ' + (this.emailData.toEmail || 'Not specified'), style: 'subheader' },
      { text: 'Subject: ' + (this.emailData.subject || 'Not specified'), style: 'subheader' },
      { text: ' ', style: 'bigspacer' },
      { text: 'Message Content:', style: 'bodyHeader' },
      {
        stack: this.parseHtmlContentForPdf(this.emailData.body, imageInfoArray)
      },
      { text: ' ', style: 'bigspacer' },
      { text: 'Admin Name: ' + (this.adminName || 'Not specified'), style: 'subheader' },
      { text: 'School Name: ' + (this.schoolName || 'Not specified'), style: 'subheader' }
    ];

    // تعريف تنسيق المستند
    const documentDefinition = {
      content: content,
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10] as [number, number, number, number]
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 5, 0, 0] as [number, number, number, number]
        },
        bodyHeader: {
          fontSize: 14,
          bold: true,
          margin: [0, 0, 0, 5] as [number, number, number, number],
          decoration: 'underline' as 'underline'
        },
        paragraph: {
          fontSize: 12,
          margin: [0, 0, 0, 5] as [number, number, number, number]
        },
        spacer: {
          margin: [0, 10, 0, 0] as [number, number, number, number]
        },
        bigspacer: {
          margin: [0, 15, 0, 0] as [number, number, number, number]
        },
        image: {
          margin: [0, 5, 0, 5] as [number, number, number, number]
        }
      }
    };

    // إنشاء وتنزيل ملف PDF
    try {
      const pdfDocGenerator = pdfMake.createPdf(documentDefinition);
      pdfDocGenerator.download('email_document.pdf');
      this.showSuccessAlert('PDF exported successfully');
    } catch (error) {
      this.showErrorAlert('Error exporting PDF');
      console.error('خطأ في تصدير ملف PDF:', error);
    }
  }).catch(error => {
    this.showErrorAlert('Error processing images in the content');
    console.error('خطأ في معالجة الصور:', error);
  });
}




// دالة جديدة لتحويل محتوى HTML إلى تنسيق مناسب لـ pdfMake مع دعم الصور
private parseHtmlContentForPdf(htmlContent: string, imageInfoArray: {id: string, data: string}[]): any[] {
  if (!htmlContent) return [];
  
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  const body = doc.body;
  const result: any[] = [];

  const processNode = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      if (text) {
        result.push({ text: text, style: 'paragraph' });
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      
      // معالجة الصور
      if (element.tagName.toLowerCase() === 'img') {
        const imgId = element.getAttribute('data-img-id');
        if (imgId) {
          const imageInfo = imageInfoArray.find(img => img.id === imgId);
          if (imageInfo) {
            result.push({
              image: imageInfo.data,
              width: 300,
              margin: [0, 5, 0, 5]
            });
          }
        }
      }
      // معالجة العناصر الأخرى
      else {
        Array.from(element.childNodes).forEach(processNode);
      }
    }
  };

  Array.from(body.childNodes).forEach(processNode);
  return result;
}

private parseHtmlNode(node: Node, result: any[], imageInfoArray?: {id: string, data: string}[]): void {
  const children = node.childNodes;

  for (let i = 0; i < children.length; i++) {
    const child = children[i];

    if (child.nodeType === Node.TEXT_NODE) {
      const text = child.textContent?.trim();
      if (text) {
        result.push({ text: text, style: 'paragraph' });
      }
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      const element = child as HTMLElement;

      switch (element.tagName.toLowerCase()) {
        case 'p': {
          const paragraphContent: any[] = [];
          this.parseHtmlNode(element, paragraphContent, imageInfoArray);

          // دعم اتجاه النص من اليمين إلى اليسار
          const isRtl = this.hasRtlText
            ? this.hasRtlText(element.textContent || '')
            : false;
          const dir = element.getAttribute('dir');
          const computedDir = getComputedStyle(element).direction;
          const rtl = isRtl || dir === 'rtl' || computedDir === 'rtl';

          result.push({
            text: paragraphContent.map(p => typeof p.text === 'string' ? p.text : '').join(' '),
            style: 'paragraph',
            alignment: rtl ? 'right' : 'left'
          });
          break;
        }
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6': {
          const headingContent: any[] = [];
          this.parseHtmlNode(element, headingContent, imageInfoArray);
          result.push({
            text: headingContent.map(h => typeof h.text === 'string' ? h.text : '').join(' '),
            style: 'subheader',
            fontSize: 20 - parseInt(element.tagName.charAt(1))
          });
          break;
        }
        case 'ul':
        case 'ol': {
          const listItems: any[] = [];
          for (let j = 0; j < element.children.length; j++) {
            if (element.children[j].tagName.toLowerCase() === 'li') {
              const liContent: any[] = [];
              this.parseHtmlNode(element.children[j], liContent, imageInfoArray);
              listItems.push(liContent.map(li => typeof li.text === 'string' ? li.text : '').join(' '));
            }
          }
          result.push({
            ul: element.tagName.toLowerCase() === 'ul' ? listItems : undefined,
            ol: element.tagName.toLowerCase() === 'ol' ? listItems : undefined,
            style: 'paragraph'
          });
          break;
        }
        case 'br':
          result.push({ text: '\n' });
          break;
        case 'strong':
        case 'b': {
          const boldContent: any[] = [];
          this.parseHtmlNode(element, boldContent, imageInfoArray);
          result.push({ text: boldContent.map(b => typeof b.text === 'string' ? b.text : '').join(' '), bold: true });
          break;
        }
        case 'em':
        case 'i': {
          const italicContent: any[] = [];
          this.parseHtmlNode(element, italicContent, imageInfoArray);
          result.push({ text: italicContent.map(i => typeof i.text === 'string' ? i.text : '').join(' '), italics: true });
          break;
        }
        case 'u': {
          const underlineContent: any[] = [];
          this.parseHtmlNode(element, underlineContent, imageInfoArray);
          result.push({ text: underlineContent.map(u => typeof u.text === 'string' ? u.text : '').join(' '), decoration: 'underline' });
          break;
        }
        case 'img':
          // معالجة الصور
          if (imageInfoArray) {
            const imgId = element.getAttribute('data-img-id');
            if (imgId) {
              const imageInfo = imageInfoArray.find(info => info.id === imgId);
              if (imageInfo) {
                result.push({
                  image: imageInfo.data,
                  width: element.clientWidth > 0 ? Math.min(element.clientWidth, 500) : 200,
                  style: 'image'
                });
              }
            } else {
              const imgSrc = element.getAttribute('src');
              if (imgSrc) {
                const newImgId = 'img_' + Math.random().toString(36).substring(2, 15);
                element.setAttribute('data-img-id', newImgId);
                this.getBase64Image(imgSrc).then(base64Data => {
                  imageInfoArray.push({
                    id: newImgId,
                    data: base64Data
                  });
                  result.push({
                    image: base64Data,
                    width: element.clientWidth > 0 ? Math.min(element.clientWidth, 500) : 200,
                    style: 'image'
                  });
                }).catch(error => {
                  console.error('فشل في تحميل الصورة:', error);
                });
              }
            }
          }
          break;
        case 'div':
        case 'span':
        default: {
          const generalContent: any[] = [];
          this.parseHtmlNode(element, generalContent, imageInfoArray);
          if (generalContent.length > 0) {
            result.push(...generalContent);
          }
          break;
        }
      }
    }
  }
}

// دالة للتحقق من النص إذا كان باللغة العربية (RTL)
private hasRtlText(text: string): boolean {
  // نطاق الأحرف العربية في Unicode
  const rtlCharsPattern = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
  return rtlCharsPattern.test(text);
}

// تحديث دالة مسح المحتوى لتمسح كل الحقول بما فيها محتوى المحرر
clearEditorContent(): void {
  console.log('مسح المحتوى - قبل:', this.emailData);
  
  // إعادة تعيين كل الحقول بالفعل
  this.emailData = {
    toEmail: '',
    subject: '',
    body: ''
  };
  
  // تأكد من مسح محتوى المحرر عن طريق التحديث المباشر للـ DOM
  // هذا يساعد إذا كان هناك مشكلة في الربط ثنائي الاتجاه مع p-editor
  try {
    const editorElement = document.querySelector('.p-editor-content .ql-editor');
    if (editorElement) {
      (editorElement as HTMLElement).innerHTML = '';
    }
    
    // مسح مباشر لمحرر Quill إذا كان متوفراً
    const quillEditor = (document.querySelector('.ql-editor') as any)?.['__quill'];
    if (quillEditor) {
      quillEditor.setText('');
    }
  } catch (error) {
    console.error('حدث خطأ أثناء مسح المحرر:', error);
  }
  
  console.log('مسح المحتوى - بعد:', this.emailData);
  
  // إظهار رسالة تأكيد المسح
  this.showSuccessAlert('Content deleted successfully');
}
    sendEmail() {
      if (!this.validateEmailForm()) {
        return;
      }
  
      const emailSub = this.shared.sendEmail(this.emailData).subscribe({
        next: (response) => {
          this.showSuccessAlert('Message Sent successfully');
          this.emailData = { toEmail: '', subject: '', body: '' };
        },
        error: (error) => {
          this.showErrorAlert(error.error?.message || 'An error occurred');
        }
      });
  
      this.subscriptions.add(emailSub);
    }
  
    private validateEmailForm(): boolean {
      if (!this.emailData.toEmail || !this.emailData.subject || !this.emailData.body) {
        this.showErrorAlert('Please Fill all fields');
        return false;
      }
      
      // تحقق من صحة البريد الإلكتروني
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.emailData.toEmail)) {
        this.showErrorAlert('Please enter a valid email address');
        return false;
      }
      
      return true;
    }
  
    private showSuccessAlert(message: string): void {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: message,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  
    private showErrorAlert(message: string): void {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: message,
        showConfirmButton: false,
        timer: 1500,
      });
    }


    navigateToAdminUpdate(): void {
      if (this.adminId) {
        this.router.navigate(['/admin-update', this.adminId]);
      } else {
        console.error('Admin ID not found!');
      }
    }
  
    logout(): void {
        // عرض نافذة تأكيد باستخدام Swal
        Swal.fire({
          title: 'Logout',
          text: 'are you sure you want to logout?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes',
          cancelButtonText: 'No'
        }).then((result) => {
          if (result.isConfirmed) {
            // إذا ضغط المستخدم على "نعم"، قم بتسجيل الخروج
            this.authService.logout();
            // يمكنك إضافة رسالة نجاح إذا أردت
            Swal.fire(
              'Logout successfully',
              'success'
            );
          }
          // إذا ضغط على "لا"، فلن يحدث شيء ويتم إغلاق النافذة تلقائياً
        });
      }
    isStudentOpen = false;
    isAdminOpen = false;
    
    toggleDropdown(menu: string) {
      if (menu === 'student') {
        this.isStudentOpen = !this.isStudentOpen;
      } else if (menu === 'admin') {
        this.isAdminOpen = !this.isAdminOpen;
      }
    }
    isSidebarOpen: boolean = true; // افتراضيًا، القائمة مفتوحة

toggleSidebar() {
  this.sidebarVisible = !this.sidebarVisible;
}

  pagesize:number=20;
  pageNumber:number=1;
  getImageUrl(logoPath: string): Promise<string> {
    return new Promise((resolve) => {
      if (!logoPath) {
        resolve('../../../assets/a4e461fe3742a7cf10a1008ffcb18744.png'); // صورة افتراضية
        return;
      }
  
      const imageUrl = `https://school-api.runasp.net/${logoPath}`;
      this.convertToWebP(imageUrl)
        .then((webpUrl) => resolve(webpUrl))
        .catch(() => resolve(imageUrl)); // في حال الفشل، يتم استخدام الصورة الأصلية
    });
  }
  
  // ✅ تحويل الصورة إلى WebP
  convertToWebP(imageUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous"; // لتفادي مشاكل CORS
      img.src = imageUrl;
  
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
  
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const webpUrl = canvas.toDataURL("image/webp", 0.8); // جودة 80%
          resolve(webpUrl);
        } else {
          reject("Canvas not supported");
        }
      };
  
      img.onerror = (err) => reject(err);
    });
  }
  
  // ✅ تحميل اللوجو وتحويله إلى WebP
  schoolLogoUrl: string = '';
  
  schoolLogo() {
    const schoolTenantId = localStorage.getItem('schoolTenantId');
  
    const filters = {
      pageNumber: this.pageNumber,
      pageSize: this.pagesize,
    };
  
    this.shared.filterSchools(filters).subscribe(
      (response: any) => {
        if (response?.result && Array.isArray(response.result)) {
          const school = response.result.find((s: any) => s.schoolTenantId === schoolTenantId);
          if (school?.schoolLogo) {
            // تحويل الصورة إلى WebP قبل العرض
            this.getImageUrl(school.schoolLogo).then((webpUrl) => {
              this.schoolLogoUrl = webpUrl;
            });
          } else {
            this.schoolLogoUrl = '../../../assets/a4e461fe3742a7cf10a1008ffcb18744.png';
          }
        } else {
          console.error('No data found or invalid response format.');
          this.schoolLogoUrl = '../../../assets/a4e461fe3742a7cf10a1008ffcb18744.png';
        }
      },
      (err) => {
        console.error('Error while filtering schools:', err);
        this.schoolLogoUrl = '../../../assets/a4e461fe3742a7cf10a1008ffcb18744.png';
      }
    );
  }

  }

  
