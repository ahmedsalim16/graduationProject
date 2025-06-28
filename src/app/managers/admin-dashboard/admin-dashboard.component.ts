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
import { ThemeService } from '../../services/theme.service';
import { ThemeToggleComponent } from '../../theme-toggle/theme-toggle.component'; 
import { ImageStorageServiceService } from '../../services/image-storage-service.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  @ViewChild('sidebarRef') sidebarRef!: Sidebar;
        
  sidebarVisible: boolean = false;
  count: number = 0;
  ManagerCount: number = 0;
  schoolCountsByMonth: number[] = new Array(12).fill(0);
  myChart: any;
  pieChart: any;
  pagesize: number = 20;
  pageNumber: number = 1;
  adminId: string | null = null;
  adminName: string | null = localStorage.getItem('username');
  schoolName: string | null = localStorage.getItem('schoolTenantId');
  isChartLoading: boolean = true;
  isPieChartLoading: boolean = true;

  admins: any[] = [];
  loading: boolean = true;
  developers: number = 0;
  resizeHandler: any;

  constructor(public shared: SharedService, public authService: AuthService, private router: Router,private adminImageService: ImageStorageServiceService,) {}

  ngOnInit(): void {
    this.getSchoolsByMonth();
    this.getManagersCount();
    this.getSchoolCount();
    this.filterAdmins();
    this.adminId = this.authService.getAdminId();
    console.log('Admin ID:', this.adminId);
  }

 // الحصول على صورة الأدمن
  getAdminImage(adminId: string): string {
    return this.adminImageService.getAdminImageOrDefault(adminId);
  }

  // التحقق من وجود صورة مخصصة
  hasCustomImage(adminId: string): boolean {
    return this.adminImageService.hasCustomImage(adminId);
  }


  ngAfterViewInit(): void {
    this.initChart();
    this.initPieChart();
  }

  navigateToAdminUpdate(): void {
    if (this.adminId) {
      this.router.navigate(['/admin-update', this.adminId]);
    } else {
      console.error('Admin ID not found!');
    }
  }

  goBack(): void {
    window.history.back();
  }

  logout(): void {
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
        this.authService.logout();
        Swal.fire(
          'Logout successfully',
          'success'
        );
      }
    });
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

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
          this.developers = this.admins.length;
          this.updatePieChart(); // Update pie chart when data is available
        } else {
          this.admins = [];
          this.developers = 0;
        }
        this.loading = false;
      },
      (err) => {
        console.error('Error while filtering admins:', err);
        this.admins = [];
        this.developers = 0;
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
          this.updateChart();
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
          this.updatePieChart(); // Update pie chart when data is available
        } else {
          console.error('No data found or invalid response format.');
        }
      },
      (err) => {
        console.error('Error while fetching school count:', err);
      }
    );
  }

  getManagersCount(): void {
    this.shared.ManagerCount()
      .pipe(
        timeout(20000),
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
            this.updatePieChart(); // Update pie chart when data is available
          } else {
            console.error('No manager data found or invalid response format.');
          }
        },
        (err) => {
          console.error('Error while fetching Managers count:', err);
        }
      );
      this.finalizeChartUpdate();
  }

  // Initialize Pie Chart
  initPieChart(): void {
    this.isPieChartLoading = true;
    
    const chartDom = document.getElementById('pieChart');
    if (chartDom) {
      this.pieChart = echarts.init(chartDom);
      
      // Show loading state
      this.pieChart.showLoading({
        text: 'Loading data...',
        color: '#4b6cb7',
        textColor: '#333',
        maskColor: 'rgba(255, 255, 255, 0.8)',
        zlevel: 0
      });
      
      // Update pie chart when all data is available
      this.updatePieChart();
      
      // Add resize listener
      window.addEventListener('resize', () => {
        setTimeout(() => this.pieChart.resize(), 200);
      });
    } else {
      console.error('Pie chart container not found!');
      this.isPieChartLoading = false;
    }
  }

  // Update Pie Chart with latest data
  updatePieChart(): void {
    // Only update if we have all required data and the chart has been initialized
    if (this.pieChart && this.count !== undefined && this.ManagerCount !== undefined && this.developers !== undefined) {
      const isMobile = window.innerWidth < 768;
      
      const option: EChartsOption = {
        title: {
          text: 'System Overview',
          subtext: 'Schools, Managers, Developers',
          left: 'center',
          textStyle: {
            fontSize: isMobile ? 14 : 16
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: isMobile ? 'center' : 'left',
          top: isMobile ? 'bottom' : 'center',
          data: ['Schools', 'Managers', 'Developers']
        },
        toolbox: {
          show: true,
          feature: {
            saveAsImage: { show: true, title: 'Save' },
            restore: { show: true, title: 'Refresh' },
            dataView: { show: true, readOnly: false, title: 'Data' }
          }
        },
        series: [
          {
            name: 'Overview',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: !isMobile,
              formatter: '{b}: {c} ({d}%)'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: isMobile ? 12 : 14,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: !isMobile
            },
            data: [
              { 
                value: this.count, 
                name: 'Schools',
                itemStyle: { color: '#4b6cb7' }
              },
              { 
                value: this.ManagerCount, 
                name: 'Managers',
                itemStyle: { color: '#D9D9D9' }
              },
              { 
                value: this.developers, 
                name: 'Developers',
                itemStyle: { color: '#C1EAF2' }
              }
            ]
          }
        ],
        animation: true,
        animationDuration: 1000,
        animationEasing: 'cubicOut'
      };

      // Apply options and hide loading
      this.pieChart.setOption(option, { notMerge: true });
      this.pieChart.hideLoading();
      this.isPieChartLoading = false;
      
      // Add event listener for restore button
      this.pieChart.off('restore');
      this.pieChart.on('restore', () => {
        console.log('Restore event triggered - Pie Chart');
        this.refreshPieChartData();
      });
    }
  }

  refreshPieChartData(): void {
    this.isPieChartLoading = true;
    if (this.pieChart) {
      this.pieChart.showLoading({
        text: 'Refreshing data...',
        color: '#4b6cb7',
        textColor: '#333',
        maskColor: 'rgba(255, 255, 255, 0.8)',
        zlevel: 0
      });
    }
    
    // Reset data and fetch again
    this.count = 0;
    this.ManagerCount = 0;
    this.developers = 0;
    
    // Refetch all data
    this.getSchoolCount();
    this.getManagersCount();
    this.filterAdmins();
  }

  // Original chart methods
  initChart(): void {
    this.isChartLoading = true;
    
    const chartDom = document.getElementById('main');
    if (chartDom) {
      this.myChart = echarts.init(chartDom);
      
      this.myChart.on('restore', () => {
        console.log('Restore event triggered - Schools');
        this.refreshChartData();
      });
      
      this.myChart.showLoading({
        text: 'Loading schools data...',
        color: '#4b6cb7',
        textColor: '#333',
        maskColor: 'rgba(255, 255, 255, 0.8)',
        zlevel: 0
      });
      
      this.loadInitialData();
    } else {
      console.error('Chart container not found!');
      this.isChartLoading = false;
    }
  }

  loadInitialData(): void {
    this.resetData();
    this.getSchoolsData();
  }

  getSchoolsData(): void {
    const filters = {
      pageNumber: this.pageNumber,
      pageSize: this.pagesize,
    };
    
    if (this.myChart) {
      this.myChart.showLoading();
    }
    
    this.shared.filterSchools(filters)
      .pipe(
        timeout(30000),
        catchError(err => {
          console.error('School data fetch timed out or failed:', err);
          this.handleChartError('Data fetch failed');
          return of({ result: [] });
        })
      )
      .subscribe(
        (response: any) => {
          if (response && response.result && Array.isArray(response.result)) {
            this.processSchoolsData(response.result);
            this.count = response.result.length;
            this.getManagersCount();
            // Important: Call finalizeChartUpdate here to ensure chart is updated after data processing
            this.finalizeChartUpdate();
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

  processSchoolsData(schools: any[]): void {
    this.schoolCountsByMonth.fill(0);
    schools.forEach((school: any) => {
      if (school.CreatedOn) {
        const date = new Date(school.CreatedOn);
        const monthIndex = date.getMonth();
        this.schoolCountsByMonth[monthIndex]++;
      }
    });
    console.log('School counts by month:', this.schoolCountsByMonth);
  }

  // Assuming this method is called after getManagersCount() completes
 

  refreshChartData(): void {
    console.log('بدء تحديث بيانات المدارس...');
    this.isChartLoading = true;

    if (this.myChart) {
      this.myChart.showLoading({
        text: 'Refreshing data...',
        color: '#4b6cb7',
        textColor: '#333',
        maskColor: 'rgba(255, 255, 255, 0.8)',
        zlevel: 0
      });
    }

    this.resetData();
    this.getSchoolsData();
  }

  resetData(): void {
    this.schoolCountsByMonth.fill(0);
    this.ManagerCount = 0;
    this.count = 0;
  }

  finalizeChartUpdate(): void {
    console.log('تم استلام جميع بيانات المدارس');
    this.updateChart();
    this.hideLoader();
  }

  handleChartError(error: any): void {
    console.error('حدث خطأ في جلب بيانات المدارس:', error);
    this.updateChart();
    this.hideLoader();
  }

  hideLoader(): void {
    // Remove timeout to ensure loader hides immediately when called
    this.isChartLoading = false;
    if (this.myChart) {
      this.myChart.hideLoading();
    }
    console.log('تم إخفاء Loader المدارس');
  }

  updateChart(): void {
    if (!this.myChart) {
      const chartDom = document.getElementById('main');
      if (chartDom) {
        this.myChart = echarts.init(chartDom, null, {
          renderer: 'canvas',
          devicePixelRatio: window.devicePixelRatio > 1 ? 2 : 1
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
        confine: true,
        textStyle: {
          fontSize: isMobile ? 10 : 12
        }
      },
      legend: {
        data: ['Schools'],
        bottom: isMobile ? 10 : 0,
        textStyle: {
          fontSize: isMobile ? 10 : 12
        }
      },
      toolbox: {
        show: true,
        orient: isMobile ? 'horizontal' : 'vertical',
        itemSize: isMobile ? 14 : 16,
        feature: {
          dataView: { 
            show: true, 
            readOnly: false,
            optionToContent: this.dataViewFormatter
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
          rotate: isMobile ? 45 : 0,
          interval: 0,
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
        barWidth: isMobile ? '40%' : '60%',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#83bff6' },
            { offset: 0.5, color: '#188df0' },
            { offset: 1, color: '#188df0' }
          ])
        },
        label: {
          show: isMobile ? false : true,
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
        lazyUpdate: true
      });
      
      // Store resize handler reference to avoid multiple listeners
      if (!this.resizeHandler) {
        this.resizeHandler = () => {
          if (this.myChart) {
            this.myChart.resize();
          }
        };
        
        window.addEventListener('resize', this.resizeHandler);
      }
      
      console.log('تم تحديث رسم المدارس بنجاح');
    } catch (error) {
      console.error('خطأ في تحديث الرسم البياني:', error);
    }
  }

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

  // Add to component class to properly clean up event listeners
  ngOnDestroy(): void {
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
    }
    
    if (this.myChart) {
      this.myChart.dispose();
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