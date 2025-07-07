import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ingredient-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ingredient-selector.component.html',
  styleUrls: ['./ingredient-selector.component.css']
})
export class IngredientSelectorComponent {
  @Input() selectedIngredients: string[] = [];
  @Input() categories: any[] = []; // Add this input
  @Output() selectedIngredientsChange = new EventEmitter<string[]>();

  toggleIngredient(ingredient: string) {
    if (this.selectedIngredients.includes(ingredient)) {
      this.selectedIngredients = this.selectedIngredients.filter(i => i !== ingredient);
    } else {
      this.selectedIngredients = [...this.selectedIngredients, ingredient];
    }
    this.selectedIngredientsChange.emit(this.selectedIngredients);
  }
}