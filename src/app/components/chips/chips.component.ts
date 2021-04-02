import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Tag } from 'src/app/services/data-model.service';
import { TagsService } from 'src/app/services/tags.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

const COMMA = 188, ENTER = 13;

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}

@Component({
  selector: 'app-chips',
  templateUrl: './chips.component.html',
})
export class ChipsComponent {
  @Input()
  editMode = false;
  readonly separatorKeysCodes = [COMMA];

  @Input()
  tags: number[] = [];

  chipInput = '';

  myControl: FormControl = new FormControl();

  filteredOptions: Observable<Tag[]>;

  constructor(private tagService: TagsService) { 
    this.filteredOptions = this.myControl.valueChanges
    .pipe(
       startWith(null),
       map(val =>
         this.tagService.tags.filter(tag => 
           tag.label.includes(val) && this.tags.find(e => e === tag.id) === undefined)));
  }

  get enrichedTags(): Tag[] {
    return this.tags
      .map(tid => this.tagService.tags.find(t => t.id === tid))
      .filter(notEmpty);
  }

  async add(event: MatChipInputEvent) {
    console.log('add', event);
    const input = event.input;
    if (event.value) {
      const value = (event.value || '').trim();
      if (input) {
        input.value = '';
      }

      const tag = this.tagService.tags.find(t => t.label === value);
      const id: number = (tag === undefined)
        ? this.tagService.create(value)
        : tag.id;
      console.log('add, after await', value, tag, id);
      this.tags.push(id);
    }
  }

  remove(elem: number): void {
    const index = this.tags.indexOf(elem);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  optionSelected(event: MatAutocompleteSelectedEvent) {
    console.log('optionSelected', event);
    this.tags.push(event.option.value.id);
    this.chipInput = '';
  }

}

