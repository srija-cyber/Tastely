import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FavoritesService } from '../../favorites.service';


interface Favorite {
  id: string;
  userId: string;
  recipeId: string;
}

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {
  favorites: Favorite[] = [];
  loading = true;
  currentUserId = 'user1'; // Get from auth service

  constructor(private favoritesService: FavoritesService) {}


  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.favoritesService.getFavorites(this.currentUserId)
      .subscribe({
        next: (favorites: Favorite[]) => {
          this.favorites = favorites;
          this.loading = false;
        },
        error: (err: any) => {
          console.error('Error loading favorites:', err);
          this.loading = false;
        }
      });
  }
}