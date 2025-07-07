import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { IngredientSelectorComponent } from '../ingredient-selector/ingredient-selector.component';
import { RecipeService } from '../../recipe.service';

@Component({
  selector: 'app-user-dishes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IngredientSelectorComponent
  ],
  templateUrl: './user-dishes.component.html',
  styleUrls: ['./user-dishes.component.css']
})
export class UserDishesComponent {
  recipe: any = {
    name: '',
    cuisine: '',
    dietType: '',
    ingredients: [],
    instructions: '',
    prepTime: null,
    image: ''
  };

  // Available options
  cuisines: string[] = [
    'Indian', 'Italian', 'Chinese', 
    'Greek', 'Mexican', 'American', 
    'Japanese', 'Thai'
  ];

  dietTypes: string[] = [
    'Vegetarian', 'Vegan', 
    'Non-Vegetarian', 'Ovo-vegetarian'
  ];

  ingredientCategories = [
    {
      name: 'Vegetables',
      items: ['Tomato', 'Onion', 'Garlic', 'Potato', 'Carrot']
    },
    {
      name: 'Spices',
      items: ['Salt', 'Pepper', 'Cumin', 'Turmeric','Paprika','Cinnamon']
    },
    {
      name: 'Proteins',
      items: ['Chicken', 'Chickpea', 'Eggs', 'Fish','Beans']
    },
    {
      name: 'Dairy',
      items: ['Milk', 'Cheese', 'Butter', 'Yogurt']
    }
  ];

  isSubmitting = false;
  submitSuccess = false;
  submitError = '';

  constructor(
    private recipeService: RecipeService,
    private router: Router
  ) {}

  
  onSubmit(form: NgForm) {
  if (this.isSubmitting || form.invalid) return;
  
  this.isSubmitting = true;
  this.submitSuccess = false;
  this.submitError = '';

  // Auto-categorize if contains eggs
  if (this.recipe.ingredients.some((ing: string) => 
      ing.toLowerCase().includes('egg'))) {
    this.recipe.dietType = 'Ovo-vegetarian';
  }

  this.recipeService.addRecipe(this.recipe).subscribe({
    next: (response) => {
      this.submitSuccess = true;
      this.isSubmitting = false;
      form.resetForm(); // Reset the form after successful submission
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 1500);
    },
    error: (error) => {
      this.submitError = 'Failed to submit recipe. Please try again.';
      this.isSubmitting = false;
      console.error('Error submitting recipe:', error);
    }
    });
  }
}