import { Category } from '../services/data-model.service';

export const findCategoryById = (id: number, categories: Category[]) => categories.find((t) => t.id === id);
export const findCategoryByLabel = (label: string, categories: Category[]) => categories.find((t) => t.label === label);
