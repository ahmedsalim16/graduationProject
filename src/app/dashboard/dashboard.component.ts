import { Component, ViewChild, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { EChartsOption } from 'echarts';
import * as echarts from 'echarts';
import { Sidebar } from 'primeng/sidebar';
import Swal from 'sweetalert2';
import { ImageStorageServiceService } from '../services/image-storage-service.service';
import { CalendarComponent } from '../calendar/calendar.component';

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
  totalIncome: number = 0; 
  
  // Chart variables
  pieChart: any;
  studentChart: any;
  isPieChartLoading: boolean = true;
  isStudentChartLoading: boolean = true;
  refreshInProgress: boolean = false;
  resizeHandler: any;
  isDarkTheme = false;

  // Grade data for student chart
  gradeData: { [key: string]: number } = {};
  gradeList: string[] = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8'];

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
    this.getStudentCountByGender(0); // Male
    this.getStudentCountByGender(1); // Female
    this.getStudentCountByGrade(); // New function for grade data
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initPieChart();
      this.initStudentChart();
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

  // ========== Enhanced Pie Chart Functions ==========
  checkAndUpdateChart(): void {
    if (this.maleStudentCount !== undefined && 
        this.femaleStudentCount !== undefined &&
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
      this.pieChart = echarts.init(chartDom);
      this.setupResizeHandler();
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
        subtext: 'Students by Gender',
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
        data: ['Male Students', 'Female Students']
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
          { value: this.maleStudentCount, name: 'Male Students', itemStyle: { color: '#36A2EB' } },
          { value: this.femaleStudentCount, name: 'Female Students', itemStyle: { color: '#FF6384' } },
          
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
  
  // ========== Student Chart Functions (Updated for Grades) ==========
  initStudentChart(): void {
    this.isStudentChartLoading = true;
    
    const chartDom = document.getElementById('studentChart');
    if (chartDom) {
      this.studentChart = echarts.init(chartDom);
      
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
    console.log('Updating student chart with grade data...');
    console.log('Grade Data:', this.gradeData);

    const gradeNames = Object.keys(this.gradeData);
    const gradeValues = Object.values(this.gradeData);

    // Ensure grades are always ordered from Grade 1 to Grade 8
    const orderedGradeNames = this.gradeList;
    const orderedGradeValues = orderedGradeNames.map(grade => this.gradeData[grade] ?? 0);

    const studentChartOption: EChartsOption = {
      title: {
      text: 'Students by Grade',
      textStyle: {
        color: this.isDarkTheme ? '#4b5563' : '#4b5563'
      }
      },
      tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: (params: any) => {
        if (Array.isArray(params)) {
        const param = params[0];
        return `${param.name}: ${param.value} students`;
        }
        return `${params.name}: ${params.value} students`;
      }
      },
      legend: {
      data: ['Students Count'],
      textStyle: {
        color: this.isDarkTheme ? '#4b5563' : '#4b5563'
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
        borderColor: this.isDarkTheme ? '#4b5563' : '#4b5563'
      }
      },
      calculable: true,
      xAxis: [
      {
        type: 'category',
        data: orderedGradeNames,
        axisLabel: {
        color: this.isDarkTheme ? '#4b5563' : '#4b5563',
        rotate: 45,
        interval: 0
        }
      },
      ],
      yAxis: [
      {
        type: 'value',
        axisLabel: {
        color: this.isDarkTheme ? '#4b5563' : '#4b5563'
        }
      },
      ],
      series: [
      {
        name: 'Students Count',
        type: 'bar',
        data: orderedGradeValues,
        itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#83bff6' },
          { offset: 0.5, color: '#188df0' },
          { offset: 1, color: '#188df0' }
        ])
        },
        markPoint: {
        data: [
          { type: 'max', name: 'Max' },
          { type: 'min', name: 'Min' },
        ],
        },
        markLine: {
        data: [{ type: 'average', name: 'Average' }],
        },
      }
      ],
    };

    if (this.studentChart) {
      this.studentChart.setOption(studentChartOption);
      this.isStudentChartLoading = false;
    }
  }
  
  refreshStudentChartData(): void {
    console.log('بدء تحديث بيانات الطلاب حسب الصف...');
    this.isStudentChartLoading = true;
  
    if (this.studentChart) {
      this.studentChart.showLoading({
        text: 'Refreshing grade data...',
        color: this.isDarkTheme ? '#4b6cb7' : '#4b6cb7',
        textColor: this.isDarkTheme ? '#ffffff' : '#333333',
        maskColor: this.isDarkTheme ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)'
      });
    }
  
    // Reset grade data
    this.gradeData = {};
  
    // Fetch updated grade data
    this.getStudentCountByGrade();
  }
  
  hideStudentChartLoader(): void {
    this.isStudentChartLoading = false;
    if (this.studentChart) {
      this.studentChart.hideLoading();
    }
    console.log('تم إخفاء مؤشر التحميل');
  }

  // ========== New Function to Get Student Count by Grade ==========
  getStudentCountByGrade(): void {
    // Initialize grade data
    this.gradeData = {};
    
    // Counter to track completed requests
    let completedRequests = 0;
    const totalGrades = this.gradeList.length;
    
    this.gradeList.forEach(grade => {
      // Extract the numeric part from the grade string, e.g., 'Grade 1' -> 1
      const gradeNumber = parseInt(grade.replace(/\D/g, ''), 10);

      const filters = {
        grade: gradeNumber,
        pageNumber: 1,
        pageSize: 1000, // Large number to get all students
      };
      
      this.shared.filterStudents(filters).subscribe(
        (response: any) => {
          if (response && response.result && Array.isArray(response.result)) {
            this.gradeData[grade] = response.result.length;
          } else {
            this.gradeData[grade] = 0;
          }
          
          completedRequests++;
          
          // Update chart when all requests are completed
          if (completedRequests === totalGrades) {
            this.updateStudentChart();
            this.hideStudentChartLoader();
          }
        },
        (err) => {
          console.error(`Error fetching student count for grade ${grade}:`, err);
          this.gradeData[grade] = 0;
          
          completedRequests++;
          
          // Update chart when all requests are completed
          if (completedRequests === totalGrades) {
            this.updateStudentChart();
            this.hideStudentChartLoader();
          }
        }
      );
    });
  }

  // ========== Data Fetching Functions ==========
  getTotalStudentCount(): void {
    this.shared.getStudentCountByGender().subscribe(
      (response) => {
        this.studentCount = response.result || 0;
        this.checkAndUpdateChart();
      },
      (err) => {
        console.error('Error fetching total student count:', err);
        this.studentCount = 0;
        this.checkAndUpdateChart();
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
        this.checkAndUpdateChart();
      },
      (err) => {
        console.error(`Error fetching student count for gender ${gender}:`, err);
        if (gender === 0) this.maleStudentCount = 0;
        if (gender === 1) this.femaleStudentCount = 0;
        this.checkAndUpdateChart();
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
          const currentTenantId = localStorage.getItem('schoolTenantId');
          
          console.log('Current Tenant ID from localStorage:', currentTenantId);
          console.log('Response data:', response.result);
          console.log('First item tenant ID:', response.result[0]?.schoolTenantId);
          
          if (!currentTenantId) {
            console.error('No schoolTenantId found in localStorage');
            this.foods = 0;
            this.checkAndUpdateChart();
            return;
          }
        
          const stock = response.result;
          
          console.log('Filtered stock:', stock);
          console.log('Stock length:', stock.length);
          
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
          const dailyIncome = response.result.totalSalesMoney || 0;
          this.Encome = dailyIncome;
          this.totalIncome += dailyIncome;
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

  resetTotalIncome(): void {
    this.totalIncome = 0;
  }

  getTotalIncome(): number {
    return this.totalIncome;
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