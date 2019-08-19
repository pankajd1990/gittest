import { Component, Input, forwardRef, HostBinding } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'time-control',
  templateUrl: './time.component.html',

  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimeComponent),
      multi: true
    }
  ]
})
export class TimeComponent implements ControlValueAccessor {
  @HostBinding('attr.id')
  externalId = '';

  @Input()
  set id(value: string) {
    this._ID = value;
    this.externalId = null;
  }

  get id() {
    return this._ID;
  }

  private _ID = '';

  @Input('value') _value = '';
  onChange: any = () => {};
  onTouched: any = () => {};
  public hh:string='';
  public mm:string='';
  public ss:string='';

  get value() {
    return this._value;
  }

  set value(val) {
    this._value = val;
    this.onChange(val);
    this.onTouched();
  }

  constructor() {}

  registerOnChange(fn) {
    this.onChange = fn;
  }

  writeValue(value) {
   
    if (value) {
      this.value = value;
    }
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  switch(event) {
      if(event.target.id=="hh") {
         this.hh= event.target.value; 
      }
      else if(event.target.id=="mm") {
        this.mm= event.target.value;  
      }
      else {
        this.ss= event.target.value;  
    }
   
    console.log(event);
    this.value=  this.hh+":"+this.mm+":"+this.ss;
   
  }
}