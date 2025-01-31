// calendar.component.ts
import { Component, OnInit } from '@angular/core';
import { CalendarOptions, EventApi } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

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
    // تحميل الأحداث المحفوظة عند بدء التشغيل
    this.savedEvents = JSON.parse(localStorage.getItem('events') || '[]');
    this.calendarOptions.events = [...this.savedEvents];
  }

  onDateClick(info: any) {
    const eventTitle = prompt("Enter event title:");
    if (eventTitle) {
      // استخدام التاريخ الذي تم النقر عليه (info.dateStr)
      const newEvent = { 
        title: eventTitle, 
        start: info.startStr, // تاريخ البدء
        color: '#191BA9', 
        textColor: '#fff' 
      };

      // إضافة الحدث إلى القائمة
      this.savedEvents.push(newEvent);

      // حفظ الأحداث في localStorage
      localStorage.setItem('events', JSON.stringify(this.savedEvents));

      // تحديث الأحداث في التقويم
      this.calendarOptions.events = [...this.savedEvents];

      // إعادة تحميل التقويم يدويًا
      const calendarApi = info.view.calendar;
      calendarApi.refetchEvents();
    }
  }

  // دالة حذف الحدث
  deleteEvent(event: EventApi) {
    // البحث عن الحدث في القائمة وحذفه
    this.savedEvents = this.savedEvents.filter(
      (e) => e.title !== event.title || e.start !== event.startStr
    );

    // حفظ القائمة المحدثة في localStorage
    localStorage.setItem('events', JSON.stringify(this.savedEvents));

    // تحديث الأحداث في التقويم
    this.calendarOptions.events = [...this.savedEvents];

    // إعادة تحميل التقويم يدويًا
    event.remove(); // إزالة الحدث من التقويم
  }
}