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
    // تحميل الأحداث المحفوظة عند بدء التشغيل
    this.savedEvents = JSON.parse(localStorage.getItem('events') || '[]');
    this.calendarOptions.events = [...this.savedEvents];
  }

  onDateClick(info: any) {
    Swal.fire({
      title: 'Add a New Event',
      input: 'text',
      inputLabel: 'Event Title',
      inputPlaceholder: 'Enter the event title here...',
      showCancelButton: true,
      confirmButtonText: 'Save',
      cancelButtonText: 'Cancel',
      allowOutsideClick: false, // Prevent closing by clicking outside the modal
      inputValidator: (value) => {
        if (!value) {
          return 'You need to enter an event title!';
        }
        return null;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const eventTitle = result.value;
  
        // Use the clicked date (info.dateStr)
        const newEvent = { 
          title: eventTitle, 
          start: info.startStr, // Event start date
          color: '#191BA9', 
          textColor: '#fff' 
        };
  
        // Add the event to the list
        this.savedEvents.push(newEvent);
  
        // Save events to localStorage
        localStorage.setItem('events', JSON.stringify(this.savedEvents));
  
        // Update events in the calendar
        this.calendarOptions.events = [...this.savedEvents];
  
        // Manually reload the calendar
        const calendarApi = info.view.calendar;
        calendarApi.refetchEvents();
  
        // Show a success message
        Swal.fire('Success!', 'The event has been added.', 'success');
      }
    });
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