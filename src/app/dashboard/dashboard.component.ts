import { Component, ViewChild, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { EChartsOption } from 'echarts';
import * as echarts from 'echarts';
import { Sidebar } from 'primeng/sidebar';
import Swal from 'sweetalert2';
import { ImageStorageServiceService } from '../services/image-storage-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild('sidebarRef') sidebarRef!: Sidebar;
      
  sidebarVisible: boolean = false;
  studentCount: number = 0;
  maleStudentCount: number = 0;
  femaleStudentCount: number = 0;
  adminId: string | null = null;
  adminName: string | null = localStorage.getItem('username');
  schoolName: string | null = localStorage.getItem('schoolTenantId');
  pagesize: number = 50;
  pageNumber: number = 1;
  role: string | null = null;
  parentCount: number = 0;
  foods: number = 0;
  Encome: number = 0;
  
  // Chart variables
  pieChart: any;
  studentChart: any; // Added for student chart
  isPieChartLoading: boolean = true;
  isStudentChartLoading: boolean = true; // Added for student chart
  refreshInProgress: boolean = false;
  resizeHandler: any;
  isDarkTheme = false;

  // Check for system theme preference
  @HostBinding('class.dark-theme') get darkMode() {
    return this.isDarkTheme;
  }
  
  constructor(public shared: SharedService, public authService: AuthService, private router: Router,private adminImageService: ImageStorageServiceService,) {
    // Check if user has a theme preference stored
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      this.isDarkTheme = storedTheme === 'dark';
    } else {
      // Check system preference
      this.isDarkTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
  }

  ngOnInit(): void {
    this.loadAllData();
    
    this.adminId = this.authService.getAdminId();
    this.schoolLogo();

    if (window.innerWidth < 768) {
      this.sidebarVisible = false;
    }
    
    window.addEventListener('resize', () => {
      if (window.innerWidth < 768) {
        this.sidebarVisible = false;
      }
    });
  }


  loadAllData(): void {
    this.getTotalStudentCount();
    this.getParentCount();
    this.getFoods();
    this.getEncome();
    this.getStudentCountByGender(0);
    this.getStudentCountByGender(1);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initPieChart();
      this.initStudentChart(); // Initialize student chart
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
    }
    
    if (this.pieChart) {
      this.pieChart.dispose();
    }
    
    if (this.studentChart) {
      this.studentChart.dispose();
    }
  }

   // الحصول على صورة الأدمن
  getAdminImage(adminId: string): string {
    return this.adminImageService.getAdminImageOrDefault(adminId);
  }

  // التحقق من وجود صورة مخصصة
  hasCustomImage(adminId: string): boolean {
    return this.adminImageService.hasCustomImage(adminId);
  }
  // ========== Theme Functions ==========


  // ========== Enhanced Pie Chart Functions ==========
  checkAndUpdateChart(): void {
    if (this.studentCount !== undefined && 
        this.parentCount !== undefined &&
        this.Encome !== undefined && 
        this.foods !== undefined) {
      this.updatePieChart();
    } else {
      setTimeout(() => this.checkAndUpdateChart(), 100);
    }
  }
  
  initPieChart(): void {
    this.isPieChartLoading = true;

    const chartDom = document.getElementById('pieChart');
    if (chartDom) {
      // Initialize chart with the correct theme
      this.pieChart = echarts.init(chartDom);
      
      // Setup resize handler
      this.setupResizeHandler();
      
      // Check and update chart when data is ready
      this.checkAndUpdateChart();
    } else {
      console.error('Pie chart container not found!');
      this.isPieChartLoading = false;
    }
  }

  setupResizeHandler(): void {
    this.resizeHandler = () => {
      if (this.pieChart) {
        setTimeout(() => this.pieChart.resize(), 200);
      }
      if (this.studentChart) {
        setTimeout(() => this.studentChart.resize(), 200);
      }
    };
    window.addEventListener('resize', this.resizeHandler);
  }

  updatePieChart(): void {
    if (!this.pieChart) return;

    const isMobile = window.innerWidth < 768;

    const option: EChartsOption = {
      title: {
        text: 'System Statistics',
        subtext: 'Students, Parents, Income, Food Items',
        left: 'center',
        textStyle: {
          fontSize: isMobile ? 14 : 16
        },
        subtextStyle: {
          color: this.isDarkTheme ? '#aaaaaa' : '#666666'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          let label = params.name || '';
          if (label) label += ': ';
          if (params.value !== null) {
            if (params.name === 'Income') {
              label += new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(params.value);
            } else {
              label += params.value;
            }
          }
          return label;
        },
      },
      legend: {
        orient: 'vertical',
        left: isMobile ? 'center' : 'left',
        top: isMobile ? 'bottom' : 'center',
        textStyle: {},
        data: ['Students', 'Parents', 'Income', 'Food Items']
      },
      toolbox: {
        show: true,
        feature: {
          saveAsImage: {
            show: true,
            title: 'Save as Image',
            iconStyle: {}
          },
          restore: {
            show: true,
            title: 'Refresh Data',
            iconStyle: {}
          },
          dataView: {
            show: true,
            readOnly: false,
            title: 'View Data',
            buttonColor: this.isDarkTheme ? '#333333' : '#eeeeee',
          }
        },
        iconStyle: {}
      },
      series: [{
        name: 'System Statistics',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 8,
          borderWidth: 2
        },
        label: {
          show: !isMobile,
          formatter: '{b}: {c}',
          textBorderColor: this.isDarkTheme ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)'
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: this.isDarkTheme ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.3)'
          },
          label: {
            show: true,
            fontSize: isMobile ? 12 : 14,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: !isMobile,
          lineStyle: {
            color: this.isDarkTheme ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'
          }
        },
        data: [
          { value: this.studentCount, name: 'Students', itemStyle: { color: '#FF6384' } },
          { value: this.parentCount, name: 'Parents', itemStyle: { color: '#36A2EB' } },
          { value: this.Encome, name: 'Income', itemStyle: { color: '#FFCE56' } },
          { value: this.foods, name: 'Food Items', itemStyle: { color: '#4BC0C0' } }
        ]
      }],
      animation: true,
      animationDuration: 800,
      animationEasing: 'cubicOut'
    };

    this.pieChart.setOption(option, { notMerge: true });
    this.pieChart.hideLoading();
    this.isPieChartLoading = false;
    this.refreshInProgress = false;

    // Add refresh event listener
    this.setupChartEvents();
  }

  setupChartEvents(): void {
    this.pieChart.off('restore');
    this.pieChart.on('restore', () => {
      this.refreshPieChartData();
    });
    
    if (this.studentChart) {
      this.studentChart.off('restore');
      this.studentChart.on('restore', () => {
        this.refreshStudentChartData();
      });
    }
  }
  
  refreshPieChartData(): void {
    if (this.refreshInProgress) return;
    
    this.refreshInProgress = true;
    this.isPieChartLoading = true;
    
    if (this.pieChart) {
      this.pieChart.showLoading({
        text: 'Refreshing data...',
        color: this.isDarkTheme ? '#4b6cb7' : '#4b6cb7',
        textColor: this.isDarkTheme ? '#ffffff' : '#333333',
        maskColor: this.isDarkTheme ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)'
      });
    }
    
    // Reset data
    this.studentCount = 0;
    this.parentCount = 0;
    this.Encome = 0;
    this.foods = 0;
    this.maleStudentCount = 0;
    this.femaleStudentCount = 0;
    
    // Re-fetch data
    setTimeout(() => {
      this.loadAllData();
    }, 300);
  }
  
  // ========== Student Chart Functions (Added from first file) ==========
  initStudentChart(): void {
    this.isStudentChartLoading = true;
    
    const chartDom = document.getElementById('studentChart');
    if (chartDom) {
      this.studentChart = echarts.init(chartDom);
      
      // Add event listener for the restore button
      this.studentChart.on('restore', () => {
        console.log('Restore event triggered');
        this.refreshStudentChartData();
      });
      
      this.updateStudentChart();
    } else {
      console.error('Student chart container not found!');
      this.isStudentChartLoading = false;
    }
  }
  
  updateStudentChart(): void {
    console.log('Updating student chart...');
    console.log('Male Count:', this.maleStudentCount);
    console.log('Female Count:', this.femaleStudentCount);

    // Set up the student chart options
    const studentChartOption: EChartsOption = {
      title: {
        text: 'Student Number',
        textStyle: {
          color: this.isDarkTheme ? '#ffffff' : '#333333'
        }
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['Girls', 'Boys', 'Total Students'],
        textStyle: {
          color: this.isDarkTheme ? '#dddddd' : '#333333'
        }
      },
      toolbox: {
        show: true,
        feature: {
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ['line', 'bar'] },
          restore: { 
            show: true,
            onclick: () => {
              console.log('Restore button clicked');
              this.refreshStudentChartData();
            }
          },
          saveAsImage: { show: true },
        },
        iconStyle: {
          borderColor: this.isDarkTheme ? '#dddddd' : '#666666'
        }
      },
      calculable: true,
      xAxis: [
        {
          type: 'category',
          data: ['Total Students'],
          axisLabel: {
            color: this.isDarkTheme ? '#dddddd' : '#333333'
          }
        },
      ],
      yAxis: [
        {
          type: 'value',
          axisLabel: {
            color: this.isDarkTheme ? '#dddddd' : '#333333'
          }
        },
      ],
      series: [
        {
          name: 'Girls',
          type: 'bar',
          data: [this.femaleStudentCount],
          color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
            { offset: 1, color: '#5CC2F2' },
          ]),
          markPoint: {
            data: [
              { type: 'max', name: 'Max' },
              { type: 'min', name: 'Min' },
            ],
          },
          markLine: {
            data: [{ type: 'average', name: 'Avg' }],
          },
        },
        {
          name: 'Boys',
          type: 'bar',
          data: [this.maleStudentCount],
          color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
            { offset: 1, color: '#C1EAF2' },
          ]),
          markPoint: {
            data: [
              { type: 'max', name: 'Max' },
              { type: 'min', name: 'Min' },
            ],
          },
          markLine: {
            data: [{ type: 'average', name: 'Avg' }],
          },
        },
        {
          name: 'Total Students',
          type: 'bar',
          data: [this.studentCount],
          color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
            { offset: 1, color: '#191BA9' },
          ]),
          markPoint: {
            data: [
              { type: 'max', name: 'Max' },
              { type: 'min', name: 'Min' },
            ],
          },
          markLine: {
            data: [{ type: 'average', name: 'Avg' }],
          },
        },
      ],
    };

    // Set the options and update the chart
    if (this.studentChart) {
      this.studentChart.setOption(studentChartOption);
      this.isStudentChartLoading = false;
    }
  }
  
  refreshStudentChartData(): void {
    console.log('بدء تحديث بيانات الطلاب...');
    this.isStudentChartLoading = true;
  
    // Show loading indicator
    if (this.studentChart) {
      this.studentChart.showLoading({
        text: 'Refreshing student data...',
        color: this.isDarkTheme ? '#4b6cb7' : '#4b6cb7',
        textColor: this.isDarkTheme ? '#ffffff' : '#333333',
        maskColor: this.isDarkTheme ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)'
      });
    }
  
    // Reset student data
    this.studentCount = 0;
    this.maleStudentCount = 0;
    this.femaleStudentCount = 0;
  
    // Fetch updated student data in sequence
    this.shared.getStudentCountByGender().subscribe({
      next: (totalRes) => {
        this.studentCount = totalRes.result || 0;
        
        this.shared.getStudentCountByGender(0).subscribe({
          next: (maleRes) => {
            this.maleStudentCount = maleRes.result || 0;
            
            this.shared.getStudentCountByGender(1).subscribe({
              next: (femaleRes) => {
                this.femaleStudentCount = femaleRes.result || 0;
                this.finalizeStudentChartUpdate();
              },
              error: (err) => this.handleStudentChartError(err)
            });
          },
          error: (err) => this.handleStudentChartError(err)
        });
      },
      error: (err) => this.handleStudentChartError(err)
    });
  }
  
  finalizeStudentChartUpdate(): void {
    console.log('تم استلام جميع بيانات الطلاب');
    this.updateStudentChart();
    this.hideStudentChartLoader();
  }
  
  handleStudentChartError(error: any): void {
    console.error('حدث خطأ في جلب بيانات الطلاب:', error);
    this.updateStudentChart();
    this.hideStudentChartLoader();
  }
  
  hideStudentChartLoader(): void {
    this.isStudentChartLoading = false;
    if (this.studentChart) {
      this.studentChart.hideLoading();
    }
    console.log('تم إخفاء مؤشر التحميل');
  }

  // ========== Data Fetching Functions ==========
  getTotalStudentCount(): void {
    this.shared.getStudentCountByGender().subscribe(
      (response) => {
        this.studentCount = response.result || 0;
        this.checkAndUpdateChart();
        this.updateStudentChart(); // Update student chart when data is received
      },
      (err) => {
        console.error('Error fetching total student count:', err);
        this.studentCount = 0;
        this.checkAndUpdateChart();
        this.updateStudentChart();
      }
    );
  }

  getStudentCountByGender(gender: number): void {
    this.shared.getStudentCountByGender(gender).subscribe(
      (response) => {
        if (gender === 0) {
          this.maleStudentCount = response.result || 0;
        } else if (gender === 1) {
          this.femaleStudentCount = response.result || 0;
        }
        this.updateStudentChart(); // Update student chart when data is received
      },
      (err) => {
        console.error(`Error fetching student count for gender ${gender}:`, err);
        if (gender === 0) this.maleStudentCount = 0;
        if (gender === 1) this.femaleStudentCount = 0;
        this.updateStudentChart();
      }
    );
  }

  getParentCount(): void {
    const filters = {
      role: this.role ?? undefined,
      pageNumber: this.pageNumber,
      pageSize: this.pagesize,
    };

    this.shared.filterAdmins(filters).subscribe(
      (response: any) => {
        if (response?.result && Array.isArray(response.result)) {
          const parents = response.result.filter(
            (user: any) => user.role === 'Parent' && user.schoolTenantId === localStorage.getItem('schoolTenantId')
          );
          this.parentCount = parents.length;
          this.checkAndUpdateChart();
        } else {
          console.error('No data found or invalid response format.');
          this.parentCount = 0;
          this.checkAndUpdateChart();
        }
      },
      (err) => {
        console.error('Error while fetching parents:', err);
        this.parentCount = 0;
        this.checkAndUpdateChart();
      }
    );
  }

  getFoods(): void {
    this.shared.getstock().subscribe(
      (response: any) => {
        if (response?.result && Array.isArray(response.result)) {
          const stock = response.result.filter(
            (user: any) => user.schoolTenantId === localStorage.getItem('schoolTenantId')
          );
          this.foods = stock.length;
          this.checkAndUpdateChart();
        } else {
          console.error('No data found or invalid response format.');
          this.foods = 0;
          this.checkAndUpdateChart();
        }
      },
      (err) => {
        console.error('Error while fetching foods:', err);
        this.foods = 0;
        this.checkAndUpdateChart();
      }
    );
  }

  getEncome(): void {
    this.shared.getDailyEncome().subscribe(
      (response: any) => {
        if (response?.result) {
          this.Encome = response.result.totalSalesMoney || 0;
          this.checkAndUpdateChart();
        } else {
          console.error('No data found or invalid response format.');
          this.Encome = 0;
          this.checkAndUpdateChart();
        }
      },
      (err) => {
        console.error('Error while fetching daily income:', err);
        this.Encome = 0;
        this.checkAndUpdateChart();
      }
    );
  }

  // ========== UI Functions ==========
  navigateToAdminUpdate(): void {
    if (this.adminId) {
      this.router.navigate(['/admin-update', this.adminId]);
    } else {
      console.error('Admin ID not found!');
    }
  }

  logout(): void {
    Swal.fire({
      title: 'Logout',
      text: 'Are you sure you want to logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout();
        Swal.fire('Logout successfully', '', 'success');
      }
    });
  }

  toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
  }

  isStudentOpen = false;
  isAdminOpen = false;
  
  toggleDropdown(menu: string): void {
    if (menu === 'student') {
      this.isStudentOpen = !this.isStudentOpen;
    } else if (menu === 'admin') {
      this.isAdminOpen = !this.isAdminOpen;
    }
  }

  // ========== School Logo Functions ==========
  schoolLogoUrl: string = '';

  schoolLogo(): void {
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

  getImageUrl(logoPath: string): Promise<string> {
    return new Promise((resolve) => {
      if (!logoPath) {
        resolve('../../../assets/a4e461fe3742a7cf10a1008ffcb18744.png');
        return;
      }

      const imageUrl = `https://school-api.runasp.net/${logoPath}`;
      this.convertToWebP(imageUrl)
        .then((webpUrl) => resolve(webpUrl))
        .catch(() => resolve(imageUrl));
    });
  }

  convertToWebP(imageUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = imageUrl;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const webpUrl = canvas.toDataURL("image/webp", 0.8);
          resolve(webpUrl);
        } else {
          reject("Canvas not supported");
        }
      };

      img.onerror = (err) => reject(err);
    });
  }
}