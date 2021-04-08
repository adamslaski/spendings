import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DataModelService } from 'src/app/services/data-model.service';

@Component({
  selector: 'app-select-category',
  templateUrl: './select-category.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => SelectCategoryComponent),
    }
  ]

})
export class SelectCategoryComponent implements ControlValueAccessor {
  category: number = 0;
  categories;
  onChange = (v: number) => { };
  onTouched = () => { };

  constructor(private dmService: DataModelService) {
    this.categories = this.dmService.categoriesView.observableValues();
  }

  get value() { return this.category; };

  set value(v: number) {
    if (v !== this.category) {
      this.category = v;

      this.onChange(v);
    }
  }

  writeValue(obj: any): void {
    this.value = obj;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

}
