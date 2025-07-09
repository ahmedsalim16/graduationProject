import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import * as echarts from 'echarts';
import { SharedService } from '../services/shared.service';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
})
export class ChartComponent implements OnInit {
  gradeData: { grade: number; count: number }[] = [];
  
  myChart: any;
  option: EChartsOption = {};
  isChartLoading: boolean = true;

  constructor(public shared: SharedService) {}

  ngOnInit(): void {
    this.initChart();
    this.loadGradeData();
  }

  // دالة لجلب عدد الطلاب لكل grade
  loadGradeData(): void {
    this.isChartLoading = true;
    
    if (this.myChart) {
      this.myChart.showLoading();
    }

    // إعادة تعيين البيانات
    this.gradeData = [];

    // إنشاء مصفوفة من الطلبات لكل grade من 1 إلى 8
    const gradeRequests = [];
    
    // Define a type for the expected response
    type FilterStudentsResponse = { result: any[] };

    for (let grade = 1; grade <= 8; grade++) {
      // طلب العدد الإجمالي لكل grade
      const totalRequest = this.shared.filterStudents({
        grade: grade,
        pageNumber: 1,
        pageSize: 9999 // رقم كبير لجلب كل البيانات
      }) as unknown as import('rxjs').Observable<FilterStudentsResponse>;

      // طلب عدد الذكور لكل grade
      const maleRequest = this.shared.filterStudents({
        grade: grade,
        gender: 0, // الذكور
        pageNumber: 1,
        pageSize: 9999
      }) as unknown as import('rxjs').Observable<FilterStudentsResponse>;

      // طلب عدد الإناث لكل grade
      const femaleRequest = this.shared.filterStudents({
        grade: grade,
        gender: 1, // الإناث
        pageNumber: 1,
        pageSize: 9999
      }) as unknown as import('rxjs').Observable<FilterStudentsResponse>;

      // دمج الطلبات الثلاثة لكل grade
      gradeRequests.push(
        forkJoin([totalRequest, maleRequest, femaleRequest]).pipe(
          map(([totalRes, maleRes, femaleRes]) => ({
            grade: grade,
            count: (totalRes as FilterStudentsResponse)?.result?.length || 0,
            maleCount: (maleRes as FilterStudentsResponse)?.result?.length || 0,
            femaleCount: (femaleRes as FilterStudentsResponse)?.result?.length || 0
          }))
        )
      );
    }

    // تنفيذ جميع الطلبات معاً
    forkJoin(gradeRequests).subscribe({
      next: (results) => {
        this.gradeData = results;
        console.log('Grade Data:', this.gradeData);
        this.updateChart();
        this.hideLoader();
      },
      error: (err) => {
        console.error('Error loading grade data:', err);
        this.handleChartError(err);
      }
    });
  }

  // دالة بديلة إذا كانت forkJoin لا تعمل - استخدام Promise.all
  loadGradeDataAlternative(): void {
    this.isChartLoading = true;
    
    if (this.myChart) {
      this.myChart.showLoading();
    }

    this.gradeData = [];

    const promises = [];
    
    for (let grade = 1; grade <= 8; grade++) {
      const gradePromise = this.getGradeCount(grade);
      promises.push(gradePromise);
    }

    Promise.all(promises).then((results) => {
      this.gradeData = results;
      console.log('Grade Data:', this.gradeData);
      this.updateChart();
      this.hideLoader();
    }).catch((err) => {
      console.error('Error loading grade data:', err);
      this.handleChartError(err);
    });
  }

  // دالة مساعدة للحصول على عدد الطلاب لكل grade
  getGradeCount(grade: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.shared.filterStudents({
        grade: grade,
        pageNumber: 1,
        pageSize: 9999
      }).subscribe({
        next: (response: any) => {
          const count = response?.result?.length || 0;
          resolve({ grade, count });
        },
        error: (err) => {
          console.error(`Error fetching count for grade ${grade}:`, err);
          resolve({ grade, count: 0 }); // إرجاع 0 في حالة الخطأ
        }
      });
    });
  }

  initChart(): void {
    const chartDom = document.getElementById('main');
    if (chartDom) {
      this.myChart = echarts.init(chartDom);
      
      this.myChart.on('restore', () => {
        console.log('Restore event triggered');
        this.refreshChartData();
      });
      
      this.updateChart();
    } else {
      console.error('Chart container not found!');
    }
  }

  updateChart(): void {
    console.log('Updating chart with grade data...');
    
    // إعداد البيانات للرسم البياني
    const gradeLabels = this.gradeData.map(item => `Grade ${item.grade}`);
    const totalData = this.gradeData.map(item => item.count);

    this.option = {
      title: {
        text: 'Students Count by Grade',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
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
              this.refreshChartData();
            }
          },
          saveAsImage: { show: true },
        },
      },
      calculable: true,
      xAxis: [
        {
          type: 'category',
          data: gradeLabels,
          axisLabel: {
            interval: 0,
            rotate: 0
          }
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: 'Number of Students'
        },
      ],
      series: [
        {
          name: 'Students',
          type: 'bar',
          data: totalData,
          color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
            { offset: 0, color: '#4f46e5' },
            { offset: 1, color: '#06b6d4' }
          ]),
          itemStyle: {
            borderRadius: [4, 4, 0, 0]
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
    this.loadGradeData();
  }

  handleChartError(error: any): void {
    console.error('حدث خطأ في جلب البيانات:', error);
    // إظهار رسم بياني فارغ أو رسالة خطأ
    this.gradeData = [];
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