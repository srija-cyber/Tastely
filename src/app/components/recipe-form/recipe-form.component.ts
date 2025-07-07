import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IngredientSelectorComponent } from '../ingredient-selector/ingredient-selector.component';
import { RecipeService } from '../../recipe.service';

@Component({
  selector: 'app-recipe-form',
  standalone: true,
  imports: [CommonModule, FormsModule, IngredientSelectorComponent],
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.css']
})
export class RecipeFormComponent {
  // Add this property to your RecipeFormComponent class
ingredientCategories = [
  {
    name: 'Vegetables',
    items: ['Tomato', 'Onion', 'Garlic', 'Potato', 'Carrot']
  },
  {
    name: 'Spices',
    items: ['Salt', 'Pepper', 'Cumin', 'Turmeric']
  },
  {
    name: 'Proteins',
    items: ['Chicken', 'Beef', 'Fish', 'Eggs']
  },
  {
    name: 'Dairy',
    items: ['Milk', 'Cheese', 'Butter', 'Yogurt']
  }
];
  
  @Output() recipeAdded = new EventEmitter<void>();
  
  recipe: any = {
    name: '',
    cuisine: '',
    dietType: '',
    ingredients: [],
    instructions: '',
    image: ''
  };
  
  cuisines = ['Indian', 'Italian', 'Chinese', 'Mexican', 'American'];
  dietTypes = ['Vegetarian', 'Vegan', 'Non-Vegetarian', 'Ovo-vegetarian'];

  constructor(private recipeService: RecipeService) {}

  onSubmit() {
    this.recipeService.addRecipe(this.recipe).subscribe(() => {
      this.recipeAdded.emit();
      this.resetForm();
    });
  }

  resetForm() {
    this.recipe = {
      name: '',
      cuisine: '',
      dietType: '',
      ingredients: [],
      instructions: '',
      image: ''
    };
  }
}