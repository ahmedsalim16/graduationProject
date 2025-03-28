// calendar.component.ts
import { Component, OnInit } from '@angular/core';
import { CalendarOptions, EventApi } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    weekends: true,
    selectable: true,
    selectAllow: (selectInfo) => {
      const day = new Date(selectInfo.start).getDay();
      return day !== 5 && day !== 6; // منع تحديد الجمعة والسبت
    },
    select: this.onDateClick.bind(this), // استدعاء الدالة عند النقر على أي يوم
    events: []
  };

  savedEvents: any[] = []; // قائمة الأحداث المحفوظة

  constructor() {}

  ngOnInit() {
    this.loadEvents(); // تحميل الأحداث عند بدء التشغيل
  }

  // 🔹 تحميل الأحداث الخاصة بالمدرسة المسجّل بها
  loadEvents(): void {
    const schoolTenantId = localStorage.getItem('schoolTenantId');
    if (!schoolTenantId) return;

    const allEvents = JSON.parse(localStorage.getItem('events') || '[]');
    
    // تصفية الأحداث بحيث يتم عرض فقط الأحداث الخاصة بالمدرسة الحالية
    this.savedEvents = allEvents.filter((event:any) => event.schoolTenantId === schoolTenantId);
    this.calendarOptions.events = [...this.savedEvents];
  }

  // 🔹 إضافة حدث جديد مربوط بـ schoolTenantId
  onDateClick(info: any) {
    Swal.fire({
      title: 'Add a New Event',
      input: 'text',
      inputLabel: 'Event Title',
      inputPlaceholder: 'Enter the event title here...',
      showCancelButton: true,
      confirmButtonText: 'Save',
      cancelButtonText: 'Cancel',
      allowOutsideClick: false, 
      inputValidator: (value) => {
        if (!value) {
          return 'You need to enter an event title!';
        }
        return null;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const eventTitle = result.value;
        const schoolTenantId = localStorage.getItem('schoolTenantId');

        if (!schoolTenantId) {
          Swal.fire('Error', 'No schoolTenantId found!', 'error');
          return;
        }

        const newEvent = { 
          title: eventTitle, 
          start: info.startStr,
          color: '#5CC2F2', 
          textColor: '#fff',
          schoolTenantId: schoolTenantId // ربط الحدث بالمدرسة
        };

        // تحميل جميع الأحداث
        const allEvents = JSON.parse(localStorage.getItem('events') || '[]');
        allEvents.push(newEvent);

        // تخزين جميع الأحداث المحدّثة في localStorage
        localStorage.setItem('events', JSON.stringify(allEvents));

        // تحديث القائمة المحلية وعرضها
        this.loadEvents();

        // إشعار المستخدم بنجاح الإضافة
        Swal.fire('Success!', 'The event has been added.', 'success');
      }
    });
  }

  // 🔹 دالة حذف الحدث
  deleteEvent(event: EventApi) {
    const schoolTenantId = localStorage.getItem('schoolTenantId');
    if (!schoolTenantId) return;

    // تحميل جميع الأحداث
    let allEvents = JSON.parse(localStorage.getItem('events') || '[]');

    // تصفية الأحداث بحيث نحذف فقط الحدث المطلوب والذي ينتمي لنفس المدرسة
    allEvents = allEvents.filter((e:any) => 
      !(e.title === event.title && e.start === event.startStr && e.schoolTenantId === schoolTenantId)
    );

    // حفظ القائمة المحدثة في localStorage
    localStorage.setItem('events', JSON.stringify(allEvents));

    // تحديث القائمة المحلية وعرضها
    this.loadEvents();
    
    // إزالة الحدث من التقويم
    event.remove();
  }
}
