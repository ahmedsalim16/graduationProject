import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any,searchFilter: any): any {
    if(!value) return null;
   if(!searchFilter) return value;

    searchFilter=searchFilter.toLowerCase();
    return value.filter((item:any)=>{
      return item.firstName.toLowerCase().indexOf(searchFilter)>-1;

  })
  }
}
