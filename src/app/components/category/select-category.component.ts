import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AppState, Store } from 'src/app/store/reducer';
import { selectCategories } from 'src/app/store/selectors';

@Component({
  selector: 'app-select-category',
  templateUrl: './select-category.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => SelectCategoryComponent),
    },
  ],
})
export class SelectCategoryComponent implements ControlValueAccessor {
  category = 0;
  categories$ = this.store.select(selectCategories);
  onChange = (v: number) => {};
  onTouched = () => {};

  constructor(private store: Store<AppState>) {}

  get value() {
    return this.category;
  }

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
