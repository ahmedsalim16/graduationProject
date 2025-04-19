import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { SharedService } from '../../services/shared.service';
import { Router } from '@angular/router';
import { EChartsOption } from 'echarts';
import * as echarts from 'echarts';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
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

  logout(): void {
    this.authService.logout(); // استدعاء وظيفة تسجيل الخروج من الخدمة
  }

  isSidebarOpen: boolean = true;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  
  getManagersCount(): void {

    this.shared.ManagerCount().subscribe(
      (response: any) => {
        if (response && response.result && Array.isArray(response.result)) {
          this.ManagerCount = response.result.length;
          console.log('Number of Managers:', this.ManagerCount);
         
        } else {
          console.error('No data found or invalid response format.');
        }
      },
      (err) => {
        console.error('Error while fetching Managers count:', err);
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
          this.updateChart(); // تحديث التشارت بعد تحديث العدد
        } else {
          console.error('No data found or invalid response format.');
        }
      },
      (err) => {
        console.error('Error while fetching school count:', err);
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
          // تصفير العدادات لكل شهر
          this.schoolCountsByMonth.fill(0);

          response.result.forEach((school: any) => {
            if (school.CreatedOn) {
              const date = new Date(school.CreatedOn);
              const monthIndex = date.getMonth(); // 0 = يناير, 1 = فبراير, ...
              this.schoolCountsByMonth[monthIndex]++;
            }
          });

          console.log('Schools per month:', this.schoolCountsByMonth);
          setTimeout(() => {
            this.updateChart();
          }, 500);
        } else {
          console.error('No data found or invalid response format.');
        }
      },
      (err) => {
        console.error('Error while fetching school count:', err);
      }
    );
  }
  initChart(): void {
    const chartDom = document.getElementById('main');
    if (chartDom) {
      this.myChart = echarts.init(chartDom);
      this.updateChart(); // تأكد من تحديث المخطط بعد التهيئة
    }
  }

  updateChart(): void {
    if (!this.myChart) {
      console.warn('Chart not initialized yet.');
      return;
    }
    if (this.myChart) {
      const option: EChartsOption = {
        title: {
          text: 'Number of Schools',
          subtext: 'Over Month'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['Schools']
        },
        toolbox: {
          show: true,
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        xAxis: {
          type: 'category',
          data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: 'Schools',
            type: 'bar',
            data: [...this.schoolCountsByMonth], 
            markPoint: {
              data: [
                { type: 'max', name: 'Max' },
                { type: 'min', name: 'Min' }
              ]
            },
            markLine: {
              data: [{ type: 'average', name: 'Avg' }]
            }
          }
        ]
      };

      this.myChart.setOption(option, { notMerge: true });
    }
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

