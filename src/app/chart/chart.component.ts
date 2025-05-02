import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import * as echarts from 'echarts';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
})
export class ChartComponent implements OnInit {
  studentCount: number = 0; // العدد الكلي للطلاب
  maleStudentCount: number = 0; // عدد الطلاب الذكور
  femaleStudentCount: number = 0; // عدد الطالبات الإناث

  myChart: any; // الرسم البياني
  option: EChartsOption = {}; // إعدادات الرسم البياني

  constructor(public shared: SharedService) {}

  ngOnInit(): void {
    this.initChart();
  this.loadInitialData();
  }
  getTotalStudentCount(): void {
    this.shared.getStudentCountByGender().subscribe(
      (response) => {
        this.studentCount = response.result || 0; // العدد الكلي للطلاب
      },
      (err) => {
        console.error('Error fetching total student count:', err);
        this.studentCount = 0;
      }
    );
  }

  getStudentCountByGender(gender: number): void {
    console.log(`Fetching student count for gender ${gender}...`); // نقطة تصحيح
    this.shared.getStudentCountByGender(gender).subscribe(
      (response) => {
        console.log(`Response for gender ${gender}:`, response); // نقطة تصحيح
        if (gender === 0) {
          this.maleStudentCount = response.result || 0; // عدد الذكور
        } else if (gender === 1) {
          this.femaleStudentCount = response.result || 0; // عدد الإناث
        }

        // تحديث الرسم البياني بعد استلام البيانات
        this.updateChart();
      },
      (err) => {
        console.error(`Error fetching student count for gender ${gender}:`, err);
        if (gender === 0) this.maleStudentCount = 0;
        if (gender === 1) this.femaleStudentCount = 0;

        // تحديث الرسم البياني حتى في حالة الخطأ
        this.updateChart();
      }
    );
  }
  loadInitialData(): void {
    this.isChartLoading = true;
    this.getTotalStudentCount();
    this.getStudentCountByGender(0);
    this.getStudentCountByGender(1);
  }
  initChart(): void {
    const chartDom = document.getElementById('main');
    if (chartDom) {
      this.myChart = echarts.init(chartDom);
      
      // إضافة حدث global listener للتأكد من عمل الأزرار
      this.myChart.on('restore', () => {
        console.log('Restore event triggered'); // هذا يجب أن يظهر عند النقر
        this.refreshChartData();
      });
      
      this.updateChart();
    } else {
      console.error('Chart container not found!');
    }
  }
  isChartLoading: boolean = true;
  updateChart(): void {
    console.log('Updating chart...'); // نقطة تصحيح
    console.log('Male Count:', this.maleStudentCount);
    console.log('Female Count:', this.femaleStudentCount);

    // إعداد البيانات الديناميكية
    const boysData = Array(12).fill(this.maleStudentCount); // بيانات الأشهر للذكور
    const girlsData = Array(12).fill(this.femaleStudentCount); // بيانات الأشهر للإناث

    // إعداد الخيارات
    this.option = {
      title: {
        text: 'Student Number',
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['Girls', 'Boys', 'Total Students'], // إضافة "Total Students" في المفتاح
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
              this.refreshChartData(); // استدعاء دالة refreshChartData عند النقر على Restore
            } // إضافة دالة عند النقر على Restore
          },
          saveAsImage: { show: true },
        },
      },
      calculable: true,
      xAxis: [
        {
          type: 'category',
          data: ['Total Students'], // صف واحد فقط
        },
      ],
      yAxis: [
        {
          type: 'value',
        },
      ],
      series: [
        {
          name: 'Girls',
          type: 'bar',
          data: [this.femaleStudentCount], // البيانات للإناث
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
          data: [this.maleStudentCount], // البيانات للذكور
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
          data: [this.studentCount], // العدد الكلي للطلاب
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
    

    // رسم الـ Chart أو تحديثه
    if (!this.myChart) {
      const chartDom = document.getElementById('main');
      if (chartDom) {
        this.myChart = echarts.init(chartDom);
      }
    }
  
    if (this.myChart) {
      this.myChart.setOption(this.option);
      this.isChartLoading = false;
    } 
  }
  refreshChartData(): void {
    console.log('بدء تحديث البيانات...');
    this.isChartLoading = true;
  
    // إظهار حالة التحميل
    if (this.myChart) {
      this.myChart.showLoading();
    }
  
    // إعادة تعيين البيانات
    this.studentCount = 0;
    this.maleStudentCount = 0;
    this.femaleStudentCount = 0;
  
    // تسلسل طلبات API مع ضمان إخفاء الـ Loader
    this.shared.getStudentCountByGender().subscribe({
      next: (totalRes) => {
        this.studentCount = totalRes.result || 0;
        
        this.shared.getStudentCountByGender(0).subscribe({
          next: (maleRes) => {
            this.maleStudentCount = maleRes.result || 0;
            
            this.shared.getStudentCountByGender(1).subscribe({
              next: (femaleRes) => {
                this.femaleStudentCount = femaleRes.result || 0;
                this.finalizeChartUpdate();
              },
              error: (err) => this.handleChartError(err)
            });
          },
          error: (err) => this.handleChartError(err)
        });
      },
      error: (err) => this.handleChartError(err)
    });
  }
  
  finalizeChartUpdate(): void {
    console.log('تم استلام جميع البيانات');
    this.updateChart();
    this.hideLoader();
  }
  
  handleChartError(error: any): void {
    console.error('حدث خطأ في جلب البيانات:', error);
    this.updateChart();
    this.hideLoader();
  }
  
  hideLoader(): void {
    this.isChartLoading = false;
    if (this.myChart) {
      this.myChart.hideLoading();
    }
    console.log('تم إخفاء الـ Loader');
  }
}
