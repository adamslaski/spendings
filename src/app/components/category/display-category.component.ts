import { Component, Input, OnInit } from '@angular/core';
import { CategoriesService } from 'src/app/services/categories.service';

@Component({
  selector: 'app-display-category',
  template: `{{ displayCategory() }}`
})
export class DisplayCategoryComponent {
  @Input()
  category = 0;

  constructor(private categoriesService: CategoriesService) {
  }

  displayCategory(): string {
    return this.categoriesService.findCategoryById(this.category)?.label || '';
  }

}
