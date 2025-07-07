import { Component, EventEmitter, Input } from '@angular/core';
import { Output } from '@angular/core';
import { FavoritesService } from '../../favorites.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of, switchMap } from 'rxjs';

@Component({
  selector: 'app-recipe-card',
  imports: [FormsModule,CommonModule],
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.css'
})
export class RecipeCardComponent {

  onViewDetails() {
    this.viewDetails.emit(this.recipe.id);
  }

  @Input() recipe: any;
  @Input() isFavorite: boolean = false; // This input must exist
  @Input() userId: string = '';
  @Output() viewDetails = new EventEmitter<string>();
  @Output() toggleFavorite = new EventEmitter<string>();
  @Output() shareRecipe = new EventEmitter<string>();
  


  constructor(private favoritesService: FavoritesService) {}

  ngOnInit() {
    if (this.userId) {
      this.favoritesService.isFavorite(this.userId, this.recipe.id)
        .subscribe(isFav => this.isFavorite = isFav);
    }
  }

  onToggleFavorite() {
    if (this.isFavorite) {
      this.favoritesService.getFavorites(this.userId).pipe(
        // Find the favorite entry for this recipe
        // (assuming each favorite has a 'recipeId' and 'id' property)
        // You may need to adjust property names as per your model
        // This uses RxJS 'switchMap' to chain the observable
        switchMap(favorites => {
          const favorite = favorites.find((f: any) => f.recipeId === this.recipe.id);
          if (favorite) {
            return this.favoritesService.removeFavorite(favorite.id);
          }
          // If not found, return an observable that completes immediately
          return of(undefined);
        })
      ).subscribe(() => this.isFavorite = false);
    } else {
      this.favoritesService.addFavorite(this.userId, this.recipe.id)
        .subscribe(() => this.isFavorite = true);
    }
    this.toggleFavorite.emit(this.recipe.id);
  }

  onShare() {
    this.shareRecipe.emit(this.recipe.id);
  }

// Removed duplicate toggleFavorite method to resolve duplicate identifier error.

}


