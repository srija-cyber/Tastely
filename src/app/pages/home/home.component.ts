import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

// Components
import { RecipeCardComponent } from '../../components/recipe-card/recipe-card.component';
import { ShareModalComponent } from '../../components/share-modal/share-modal.component';

// Services
import { RecipeService } from '../../recipe.service';
import { FavoritesService } from '../../favorites.service';

// Types
interface Recipe {
  id: string;
  name: string;
  cuisine: string;
  image?: string;
  prepTime: number;
  ingredients: string[];
  nutrition?: {
    calories?: number;
    [key: string]: any;
  };
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RecipeCardComponent,
    ShareModalComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  // Filter options
  availableIngredients: string[] = [
    'Tomato', 'Onion', 'Rice', 'Paneer', 
    'Chicken', 'Garlic', 'Cabbage', 'Lettuce'
  ];
  
  cuisines: string[] = [
    'All', 'Indian', 'Italian', 'Chinese', 
    'Greek', 'Mexican', 'American', 'Turkish', 'Japanese','Thai'
  ];
  
  dietTypes: string[] = [
    'Vegetarian', 'Vegan', 'Non-Vegetarian', 
    'Ovo-vegetarian'
  ];

  // Filter state
  selectedIngredients: string[] = [];
  selectedCuisine: string = 'All';
  selectedDietType: string = '';
  dishQuery: string = '';

  // Data
  recipes: Recipe[] = [];
  isLoading: boolean = false;
  error: string | null = null;

  // Modal state
  showShareModal: boolean = false;
  recipeToShare: Recipe | null = null;

  constructor(
    private recipeService: RecipeService,
    private favoritesService: FavoritesService,
    private router: Router
  ) {
    this.fetchRecipes();
  }



  // Fetch recipes with current filters
  fetchRecipes(): void {
    this.isLoading = true;
    this.error = null;

    this.recipeService.getFilteredRecipes(
      this.selectedIngredients,
      this.selectedCuisine,
      this.dishQuery,
      this.selectedDietType
    ).pipe(
      catchError(error => {
        this.error = 'Failed to load recipes. Please try again.';
        console.error('Error fetching recipes:', error);
        return of([]);
      }),
      finalize(() => this.isLoading = false)
    ).subscribe(recipes => {
      this.recipes = recipes;
    });
  }

  // Filter handlers
  toggleIngredient(ingredient: string): void {
    this.selectedIngredients = this.selectedIngredients.includes(ingredient)
      ? this.selectedIngredients.filter(i => i !== ingredient)
      : [...this.selectedIngredients, ingredient];
    this.fetchRecipes();
  }

  selectCuisine(cuisine: string): void {
    this.selectedCuisine = cuisine;
    this.fetchRecipes();
  }

  selectDietType(dietType: string): void {
    this.selectedDietType = dietType;
    this.fetchRecipes();
  }

  onDishSearch(): void {
    this.fetchRecipes();
  }

  resetFilters(): void {
    this.selectedIngredients = [];
    this.selectedCuisine = 'All';
    this.selectedDietType = '';
    this.dishQuery = '';
    this.fetchRecipes();
  }

  // Recipe actions
  toggleFavorite(id: string): void {
    // Implement actual favorite toggle logic using FavoritesService
    this.favoritesService.toggleFavorite('currentUserId', id).subscribe({
      next: () => console.log('Favorite toggled successfully'),
      error: err => console.error('Error toggling favorite:', err)
    });
  }

  isFavorite(id: string): boolean {
    // Implement actual favorite check
    return false; // Temporary
  }

  goToDetails(id: string): void {
    this.router.navigate(['/recipe', id]);
  }

  // Modal handlers
  openShareModal(recipe: Recipe): void {
    this.recipeToShare = recipe;
    this.showShareModal = true;
  }

  closeShareModal(): void {
    this.showShareModal = false;
    this.recipeToShare = null;
  }

  //   ngAfterViewInit() {
  //   this.loadChatbotScript();
  // }

  // private loadChatbotScript() {
  //   // Check if script already exists
  //   if (document.getElementById('jotform-chatbot-script')) {
  //     return;
  //   }

  //   const script = document.createElement('script');
  //   script.id = 'jotform-chatbot-script';
  //   script.src = 'https://cdn.jotfor.ms/agent/embedjs/0197c44a66f4772f8e18523610d519d12e6f/embed.js?skipWelcome=1&maximizable=1';
  //   script.async = true;
    
  //   // Optional: Add error handling
  //   script.onerror = () => console.error('Failed to load chatbot script');
    
  //   document.body.appendChild(script);
  // }

}