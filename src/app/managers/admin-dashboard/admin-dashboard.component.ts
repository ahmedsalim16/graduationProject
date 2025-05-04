import { Component, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { SharedService } from '../../services/shared.service';
import { Router } from '@angular/router';
import { EChartsOption } from 'echarts';
import * as echarts from 'echarts';
import { Sidebar } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import Swal from 'sweetalert2';
import { ThemeService } from '../../services/theme.service'; // استيراد خدمة الثيم
import { ThemeToggleComponent } from '../../theme-toggle/theme-toggle.component'; 
@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
   @ViewChild('sidebarRef') sidebarRef!: Sidebar;
        
      sidebarVisible: boolean = false;
  count:number=0;
  ManagerCount:number=0
  schoolCountsByMonth: number[] = new Array(12).fill(0);
  myChart: any;
  pagesize:number=20;
  pageNumber:number=1;
  adminId: string | null = null;
  adminName:string | null = localStorage.getItem('username');
  schoolName:string | null = localStorage.getItem('schoolTenantId');
  constructor(public shared: SharedService,public authService:AuthService,private router: Router) {}

  ngOnInit(): void {
    this.getSchoolsByMonth();
    this.getManagersCount();
     this.getSchoolCount();
     this.filterAdmins(); // استدعاء دالة تصفية الأدمنين
    this.adminId = this.authService.getAdminId(); // الحصول على ID الأدمن
    console.log('Admin ID:', this.adminId);
  }

  ngAfterViewInit(): void {
    this.initChart(); // تجهيز المخطط بعد تحميل الصفحة
  }

  navigateToAdminUpdate(): void {
    if (this.adminId) {
      this.router.navigate(['/admin-update', this.adminId]);
    } else {
      console.error('Admin ID not found!');
    }
  }
  goBack(): void {
    // Logic to navigate back, e.g., using Angular Router
    window.history.back();
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

  isSidebarOpen: boolean = true;

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }
  
  // getManagersCount(): void {

  //   this.shared.ManagerCount().subscribe(
  //     (response: any) => {
  //       if (response && response.result && Array.isArray(response.result)) {
  //         this.ManagerCount = response.result.length;
  //         console.log('Number of Managers:', this.ManagerCount);
         
  //       } else {
  //         console.error('No data found or invalid response format.');
  //       }
  //     },
  //     (err) => {
  //       console.error('Error while fetching Managers count:', err);
  //     }
  //   );
  // }
  admins: any[] = [];
  loading: boolean = true;
  developers: number = 0;

  filterAdmins(): void {
    this.loading = true;
    const filters = {
      role: 'Admin',
      pageNumber: this.pageNumber,
      pageSize: this.pagesize,
    };

    this.shared.filterAdmins(filters).subscribe(
      (response: any) => {
        if (response && response.result) {
          this.admins = response.result.filter((user: any) => 
            user.schoolTenantId === localStorage.getItem('schoolTenantId')
          );
          this.developers = this.admins.length; // Set the developers variable
        } else {
          this.admins = [];
          this.developers = 0; // Set to 0 if no admins found
        }
        this.loading = false;
      },
      (err) => {
        console.error('Error while filtering admins:', err);
        this.admins = [];
        this.developers = 0; // Set to 0 in case of error
        this.loading = false;
      }
    );
  }

  getSchoolsByMonth(): void {
    const filters = {
      pageNumber: this.pageNumber,
      pageSize: this.pagesize,
    };
    
    this.shared.filterSchools(filters).subscribe(
      (response: any) => {
        if (response && response.result && Array.isArray(response.result)) {
          this.schoolCountsByMonth.fill(0);
  
          response.result.forEach((school: any) => {
            if (school.CreatedOn) {
              const date = new Date(school.CreatedOn);
              const monthIndex = date.getMonth();
              this.schoolCountsByMonth[monthIndex]++;
            }
          });
  
          console.log('Schools per month:', this.schoolCountsByMonth);
          this.updateChart(); // تحديث الـ Chart بعد جلب البيانات
        } else {
          console.error('No data found or invalid response format.');
          this.isChartLoading = false;
        }
      },
      (err) => {
        console.error('Error while fetching school count:', err);
        this.isChartLoading = false;
      }
    );
  }
  
  getSchoolCount(): void {
    const filters = {
      pageNumber: this.pageNumber,
      pageSize: this.pagesize,
    };
  
    this.shared.filterSchools(filters).subscribe(
      (response: any) => {
        if (response && response.result && Array.isArray(response.result)) {
          this.count = response.result.length;
          console.log('Number of Schools:', this.count);
        } else {
          console.error('No data found or invalid response format.');
        }
      },
      (err) => {
        console.error('Error while fetching school count:', err);
      }
    );
  }
  isChartLoading: boolean = true;
  // في ملف admin-dashboard.component.ts

initChart(): void {
  this.isChartLoading = true;
  
  const chartDom = document.getElementById('main');
  if (chartDom) {
    this.myChart = echarts.init(chartDom);
    
    // إضافة مستمع للحدث restore
    this.myChart.on('restore', () => {
      console.log('Restore event triggered - Schools');
      this.refreshChartData();
    });
    
    // إظهار loader أولاً
    this.myChart.showLoading({
      text: 'Loading schools data...',
      color: '#4b6cb7',
      textColor: '#333',
      maskColor: 'rgba(255, 255, 255, 0.8)',
      zlevel: 0
    });
    
    // تحميل البيانات الأولية
    this.loadInitialData();
  } else {
    console.error('Chart container not found!');
    this.isChartLoading = false;
  }
}

loadInitialData(): void {
  // إعادة تعيين البيانات
  this.resetData();
  
  // بدء سلسلة طلبات API
  this.getSchoolsData();
}

getSchoolsData(): void {
  const filters = {
    pageNumber: this.pageNumber,
    pageSize: this.pagesize,
  };
  
  // يتم إظهار loader
  if (this.myChart) {
    this.myChart.showLoading();
  }
  
  // تنفيذ طلب API لجلب بيانات المدارس
  this.shared.filterSchools(filters)
    .pipe(
      timeout(30000), // 30 ثانية كحد أقصى
      catchError(err => {
        console.error('School data fetch timed out or failed:', err);
        return of({ result: [] });
      })
    )
    .subscribe(
      (response: any) => {
        if (response && response.result && Array.isArray(response.result)) {
          // معالجة بيانات المدارس
          this.processSchoolsData(response.result);
          this.count = response.result.length;
          
          // استكمال باقي الطلبات
          this.getManagersCount();
        } else {
          console.error('No schools found or invalid response format.');
          this.handleChartError('Invalid school data');
        }
      },
      (err) => {
        console.error('Error while fetching school data:', err);
        this.handleChartError(err);
      }
    );
}

getManagersCount(): void {
  this.shared.ManagerCount()
    .pipe(
      timeout(20000), // 20 ثانية كحد أقصى
      catchError(err => {
        console.error('Manager count fetch timed out or failed:', err);
        return of({ result: [] });
      })
    )
    .subscribe(
      (response: any) => {
        if (response && response.result && Array.isArray(response.result)) {
          this.ManagerCount = response.result.length;
          console.log('Number of Managers:', this.ManagerCount);
          
          // بعد الانتهاء من جميع الطلبات، قم بتحديث الرسم البياني
          this.finalizeChartUpdate();
        } else {
          console.error('No manager data found or invalid response format.');
          this.finalizeChartUpdate(); // تحديث حتى مع وجود خطأ
        }
      },
      (err) => {
        console.error('Error while fetching Managers count:', err);
        this.finalizeChartUpdate(); // تحديث حتى مع وجود خطأ
      }
    );
}

refreshChartData(): void {
  console.log('بدء تحديث بيانات المدارس...');
  this.isChartLoading = true;

  // إظهار حالة التحميل
  if (this.myChart) {
    this.myChart.showLoading({
      text: 'Refreshing data...',
      color: '#4b6cb7',
      textColor: '#333',
      maskColor: 'rgba(255, 255, 255, 0.8)',
      zlevel: 0
    });
  }

  // إعادة تعيين البيانات
  this.resetData();

  // بدء سلسلة طلبات البيانات
  this.getSchoolsData();
}

resetData(): void {
  this.schoolCountsByMonth.fill(0);
  this.ManagerCount = 0;
  this.count = 0;
}

private processSchoolsData(schools: any[]): void {
  this.schoolCountsByMonth.fill(0); // إعادة تعيين العدادات
  schools.forEach((school: any) => {
    if (school.CreatedOn) {
      const date = new Date(school.CreatedOn);
      const monthIndex = date.getMonth();
      this.schoolCountsByMonth[monthIndex]++;
    }
  });
  console.log('School counts by month:', this.schoolCountsByMonth);
}

finalizeChartUpdate(): void {
  console.log('تم استلام جميع بيانات المدارس');
  this.updateChart();
  this.hideLoader();
}

handleChartError(error: any): void {
  console.error('حدث خطأ في جلب بيانات المدارس:', error);
  this.updateChart(); // تحديث الرسم البياني حتى مع وجود خطأ
  this.hideLoader();
}

hideLoader(): void {
  setTimeout(() => {
    this.isChartLoading = false;
    if (this.myChart) {
      this.myChart.hideLoading();
    }
    console.log('تم إخفاء Loader المدارس');
  }, 100);
}

updateChart(): void {
  if (!this.myChart) {
    const chartDom = document.getElementById('main');
    if (chartDom) {
      this.myChart = echarts.init(chartDom, null, {
        renderer: 'canvas',
        devicePixelRatio: window.devicePixelRatio > 1 ? 2 : 1 // تحسين الدقة للشاشات عالية الدقة
      });
    } else {
      console.error('عنصر الرسم البياني غير موجود');
      return;
    }
  }

  const isMobile = window.innerWidth < 768;
  
  const option: EChartsOption = {
    title: {
      text: 'Number of Schools',
      subtext: 'Over Month',
      textStyle: {
        fontSize: isMobile ? 12 : 14
      }
    },
    tooltip: {
      trigger: 'axis',
      confine: true, // منع الخروج عن حدود الشاشة
      textStyle: {
        fontSize: isMobile ? 10 : 12
      }
    },
    legend: {
      data: ['Schools'],
      bottom: isMobile ? 10 : 0, // تعديل موقع الأسطورة
      textStyle: {
        fontSize: isMobile ? 10 : 12
      }
    },
    toolbox: {
      show: true,
      orient: isMobile ? 'horizontal' : 'vertical', // اتجاه الأدوات حسب حجم الشاشة
      itemSize: isMobile ? 14 : 16,
      feature: {
        dataView: { 
          show: true, 
          readOnly: false,
          optionToContent: this.dataViewFormatter // تنسيق عرض البيانات
        },
        magicType: { 
          show: true, 
          type: ['line', 'bar'],
          title: {
            line: 'Line',
            bar: 'Bar'
          }
        },
        restore: { 
          show: true,
          title: 'Refresh'
        },
        saveAsImage: { 
          show: true,
          title: 'Save',
          pixelRatio: 2
        }
      }
    },
    grid: {
      left: isMobile ? '3%' : '5%',
      right: isMobile ? '4%' : '5%',
      bottom: isMobile ? '20%' : '15%',
      top: isMobile ? '15%' : '20%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      axisLabel: {
        rotate: isMobile ? 45 : 0, // تدوير التسميات على الهواتف
        interval: 0, // عرض جميع التسميات
        fontSize: isMobile ? 9 : 11,
        margin: isMobile ? 5 : 10
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        fontSize: isMobile ? 9 : 11
      }
    },
    series: [{
      name: 'Schools',
      type: 'bar',
      data: [...this.schoolCountsByMonth],
      barWidth: isMobile ? '40%' : '60%', // تعديل عرض الأعمدة
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#83bff6' },
          { offset: 0.5, color: '#188df0' },
          { offset: 1, color: '#188df0' }
        ])
      },
      label: {
        show: isMobile ? false : true, // إخفاء التسميات على الهواتف
        position: 'top'
      }
    }],
    animation: true,
    animationDuration: 1000,
    animationEasing: 'cubicOut'
  };

  try {
    this.myChart.setOption(option, { 
      notMerge: true,
      lazyUpdate: true // تحسين الأداء
    });
    
    // إعادة حجم الـ Chart عند تغيير حجم النافذة
    window.addEventListener('resize', () => {
      setTimeout(() => this.myChart.resize(), 200);
    });
    
    console.log('تم تحديث رسم المدارس بنجاح');
  } catch (error) {
    console.error('خطأ في تحديث الرسم البياني:', error);
  }
}

// دالة مساعدة لتنسيق عرض البيانات
private dataViewFormatter(opt: any): string {
  const axisData = opt.xAxis[0].data;
  const seriesData = opt.series[0].data;
  
  let html = '<div style="font-family: sans-serif; font-size: 12px; padding: 10px">';
  html += '<table style="width:100%; border-collapse:collapse">';
  html += '<tr><th style="padding:5px; border:1px solid #ddd">Month</th><th style="padding:5px; border:1px solid #ddd">Schools</th></tr>';
  
  for (let i = 0; i < axisData.length; i++) {
    html += `<tr>
      <td style="padding:5px; border:1px solid #ddd">${axisData[i]}</td>
      <td style="padding:5px; border:1px solid #ddd">${seriesData[i]}</td>
    </tr>`;
  }
  
  html += '</table></div>';
  return html;
}
  isSchoolOpen = false;
isAdminOpen = false;

toggleDropdown(menu: string) {
  if (menu === 'school') {
    this.isSchoolOpen = !this.isSchoolOpen;
  } else if (menu === 'admin') {
    this.isAdminOpen = !this.isAdminOpen;
  }
}
}

