import { Component } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { CalendarOptions } from '@fullcalendar/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent {

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    weekends: true,
    events: [
      { title: 'Meeting', color: '#378006', start: new Date() },
      {title: 'Event 1',
        date: '2024-11-01',
        color: '#03A9F4', // Event background color
        textColor: '#ffffff', // Event text color
        classNames: ['custom-event']
      },
      {title: 'Event 2',
        date: '2024-11-20',
        color: '#191BA9', // Event background color
        textColor: '#ffffff', // Event text color
        classNames: ['custom-event']
      }
    ],

    
  };



// constructor(){}

// selectedDate: Date | null = null;

//   // Dates to highlight
//   highlightDates = [
//     new Date(2021, 2, 8), // March 8, 2021
//     new Date(2021, 2, 20), // March 20, 2021
//     new Date(2021, 2, 23)  // March 23, 2021
//   ];

//   // Function triggered when a date is selected
//   dateChanged(date: Date): void {
//     this.selectedDate = date;
//     console.log('Selected date:', this.selectedDate);
//   }

//   // Function to apply CSS class to highlighted dates
//   dateClass = (date: Date) => {
//     const highlightDate = this.highlightDates.some(
//       (d) =>
//         d.getDate() === date.getDate() &&
//         d.getMonth() === date.getMonth() &&
//         d.getFullYear() === date.getFullYear()
//     );
//     return highlightDate ? 'highlight-date' : '';
//   };




month: string = 'March';
  year: number = 2021;
  calendar: any[][] = [];
  currentDay: number = new Date().getDate();

  constructor() {
    this.generateCalendar();
  }

  generateCalendar() {
    const firstDay = new Date(this.year, this.getMonthIndex(), 1).getDay();
    const numDays = new Date(this.year, this.getMonthIndex() + 1, 0).getDate();

    // Initialize a 2D array to represent the calendar grid
    this.calendar = [];

    // Fill the first week with empty cells until the first day of the month
    let day = 1;
    let week = [];
    for (let i = 0; i < firstDay; i++) {
      week.push(null);
    }

    // Fill the rest of the weeks with the days of the month
    for (let i = firstDay; i < 7; i++) {
      week.push(day);
      day++;
    }
    this.calendar.push(week);

    // Fill the remaining weeks with the days of the month
    while (day <= numDays) {
      week = [];
      for (let i = 0; i < 7; i++) {
        if (day <= numDays) {
          week.push(day);
          day++;
        } else {
          week.push(null);
        }
      }
      this.calendar.push(week);
    }
  }

  getMonthIndex() {
    switch (this.month) {
      case 'January':
        return 0;
      case 'February':
        return 1;
      case 'March':
        return 2;
      case 'April':
        return 3;
      case 'May':
        return 4;
      case 'June':
        return 5;
      case 'July':
        return 6;
      case 'August':
        return 7;
      case 'September':
        return 8;
      case 'October':
        return 9;
      case 'Novamber':
        return 10;
      case 'Decamber':
        return 11;
      default :
        return -1;

    }
  }
      
}
