import { Component, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Category, DataModelService } from 'src/app/services/data-model.service';
import { CategoriesService } from 'src/app/services/categories.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

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
export class SelectCategoryComponent implements OnInit, ControlValueAccessor {
  category: number = 0;

  myControl: FormControl = new FormControl();

  filteredOptions: Observable<Category[]>;

  onChange = (v: number) => { };

  onTouched = () => { };

  constructor(private categoriesService: CategoriesService, private dmService: DataModelService) {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(null),
        map(val =>
          this.dmService.categoriesView.values().filter(cat => cat.label.includes(val)))
      );
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

  ngOnInit(): void {
    this.reset();
  }

  reset(): void {
    this.myControl.setValue('');
  }

  optionSelected(event: MatAutocompleteSelectedEvent) {
    console.log('optionSelected', event);
    this.value = (event.option.value.id);
  }

  displayFn(category: Category): string {
    return category.label;
  }

}
