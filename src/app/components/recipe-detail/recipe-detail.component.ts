import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../../recipe.service';
import { FavoritesService } from '../../favorites.service';
import { ShareService } from '../../share.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: any = null;
  error: string | null = null;
  isFavorite: boolean = false;
  currentUserId = 'user1'; // Replace with actual user ID from auth service
  showShareModal = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService,
    private favoritesService: FavoritesService,
    private shareService: ShareService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadRecipe(id);
        this.checkFavoriteStatus(id);
      }
    });
  }

  loadRecipe(id: string): void {
    this.recipeService.getRecipeById(id).subscribe({
      next: (recipe) => {
        this.recipe = recipe;
        this.error = null;
      },
      error: (err) => {
        this.error = 'Failed to load recipe. Please try again later.';
        console.error('Error loading recipe:', err);
      }
    });
  }

  checkFavoriteStatus(recipeId: string): void {
    this.favoritesService.isFavorite(this.currentUserId, recipeId).subscribe({
      next: (isFav) => {
        this.isFavorite = isFav;
      },
      error: (err) => {
        console.error('Error checking favorite status:', err);
      }
    });
  }

  toggleFavorite(): void {
    if (!this.recipe) return;
    
    const recipeId = this.recipe.id;
    
    if (this.isFavorite) {
      // First find the favorite to get its ID
      this.favoritesService.getFavorites(this.currentUserId).subscribe({
        next: (favorites) => {
          const favorite = favorites.find(f => f.recipeId === recipeId);
          if (favorite) {
            this.favoritesService.removeFavorite(favorite.id).subscribe({
              next: () => {
                this.isFavorite = false;
              },
              error: (err) => {
                console.error('Error removing favorite:', err);
              }
            });
          }
        },
        error: (err) => {
          console.error('Error finding favorite:', err);
        }
      });
    } else {
      this.favoritesService.addFavorite(this.currentUserId, recipeId).subscribe({
        next: () => {
          this.isFavorite = true;
        },
        error: (err) => {
          console.error('Error adding favorite:', err);
        }
      });
    }
  }

  // Alternative toggleFavorite using the helper method
  /*
  toggleFavorite(): void {
    if (!this.recipe) return;
    
    const recipeId = this.recipe.id;
    
    if (this.isFavorite) {
      this.favoritesService.removeFavoriteByUserAndRecipe(this.currentUserId, recipeId).subscribe({
        next: () => {
          this.isFavorite = false;
        },
        error: (err) => {
          console.error('Error removing favorite:', err);
        }
      });
    } else {
      this.favoritesService.addFavorite(this.currentUserId, recipeId).subscribe({
        next: () => {
          this.isFavorite = true;
        },
        error: (err) => {
          console.error('Error adding favorite:', err);
        }
      });
    }
  }
  */

  shareRecipe(): void {
    if (this.recipe) {
      this.shareService.shareRecipe(this.recipe);
    }
  }

  formatInstructions(instructions: string): string {
    if (!instructions) return '';
    return instructions.replace(/\n/g, '</p><p>');
  }

  retryLoading(): void {
    if (this.recipe?.id) {
      this.loadRecipe(this.recipe.id);
    }
  }

  openShareModal() {
    this.showShareModal = true;
  }

  closeShareModal() {
    this.showShareModal = false;
  }
}