import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

interface Favorite {
  id: string;
  userId: string;
  recipeId: string;
}

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private apiUrl = 'http://localhost:3000/favorites';

  constructor(private http: HttpClient) {}

  // Get all favorites for a user
  getFavorites(userId: string): Observable<Favorite[]> {
    return this.http.get<Favorite[]>(`${this.apiUrl}?userId=${userId}`).pipe(
      catchError(error => {
        console.error('Error fetching favorites:', error);
        return of([]);
      })
    );
  }

  // Add a new favorite
  addFavorite(userId: string, recipeId: string): Observable<Favorite> {
    const newFavorite = { userId, recipeId };
    return this.http.post<Favorite>(this.apiUrl, newFavorite).pipe(
      catchError(error => {
        console.error('Error adding favorite:', error);
        throw error;
      })
    );
  }

  // Remove a favorite by ID (updated to only accept ID)
  removeFavorite(favoriteId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${favoriteId}`).pipe(
      catchError(error => {
        console.error('Error removing favorite:', error);
        throw error;
      })
    );
  }

  // New helper method to remove by userId and recipeId
  removeFavoriteByUserAndRecipe(userId: string, recipeId: string): Observable<void> {
    return this.getFavorites(userId).pipe(
      switchMap(favorites => {
        const favorite = favorites.find(f => f.recipeId === recipeId);
        if (favorite) {
          return this.removeFavorite(favorite.id);
        }
        return of(undefined);
      }),
      catchError(error => {
        console.error('Error finding favorite to remove:', error);
        throw error;
      })
    );
  }

  // Check if a recipe is favorited by user
  isFavorite(userId: string, recipeId: string): Observable<boolean> {
    return this.http.get<Favorite[]>(
      `${this.apiUrl}?userId=${userId}&recipeId=${recipeId}`
    ).pipe(
      map(favorites => favorites.length > 0),
      catchError(error => {
        console.error('Error checking favorite status:', error);
        return of(false);
      })
    );
  }

  // Toggle favorite status
  toggleFavorite(userId: string, recipeId: string): Observable<boolean> {
    return this.isFavorite(userId, recipeId).pipe(
      switchMap(isFavorited => {
        if (isFavorited) {
          return this.removeFavoriteByUserAndRecipe(userId, recipeId).pipe(
            map(() => false)
          );
        } else {
          return this.addFavorite(userId, recipeId).pipe(
            map(() => true)
          );
        }
      }),
      catchError(error => {
        console.error('Error toggling favorite:', error);
        throw error;
      })
    );
  }
}