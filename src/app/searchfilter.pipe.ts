import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchfilterPipe implements PipeTransform {

  transform(value: any,fdata:any, ...args:any): any {
    
    console.log(value);
    console.log(fdata);
    if(fdata != null){

      
        return value.filter(e => (e.name.toUpperCase().startsWith(fdata.toUpperCase())));
    }
    else
      return value;
  }

}
