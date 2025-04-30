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
    this.getTotalStudentCount();
    this.getStudentCountByGender(0); // جلب عدد الذكور
    this.getStudentCountByGender(1); // جلب عدد الإناث
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
          restore: { show: true },
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
      const chartDom = document.getElementById('main')!;
      this.myChart = echarts.init(chartDom);
    }
    this.myChart.setOption(this.option);
    this.isChartLoading = false; 
  }
}
