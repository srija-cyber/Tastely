// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable, map, catchError, throwError } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class RecipeService {
//   private apiUrl = 'http://localhost:3000/recipes';

//   constructor(private http: HttpClient) {}

//   // Get all recipes and filter in the frontend
//   getFilteredRecipes(selectedIngredients: string[], selectedCuisine: string, dishQuery: string): Observable<any[]> {
//     return this.http.get<any[]>(this.apiUrl).pipe(
//       map(recipes => {
//         return recipes.filter(recipe => {
//           const matchesCuisine = selectedCuisine === 'All' || recipe.cuisine.toLowerCase() === selectedCuisine.toLowerCase();
//           const matchesDishName = dishQuery.trim() === '' || recipe.name.toLowerCase().includes(dishQuery.toLowerCase());

//           const matchedIngredients = selectedIngredients.filter(ing =>
//             recipe.ingredients.map((i: string) => i.toLowerCase()).includes(ing.toLowerCase())
//           );

//           // const ingredientMatch = matchedIngredients.length >= recipe.ingredients.length - 2;
//           const ingredientMatch = selectedIngredients.length === 0 || matchedIngredients.length > 0;


//           return matchesCuisine && matchesDishName && ingredientMatch;
//         });
//       })
//     );
//   }

//     addRecipe(recipe: any): Observable<any> {
//     return this.http.post(`${this.apiUrl}/recipes`, recipe);
//   }

//   addComment(recipeId: string, comment: any): Observable<any> {
//     return this.http.post(`${this.apiUrl}/recipes/${recipeId}/comments`, comment);
//   }

//   getComments(recipeId: string): Observable<any[]> {
//     return this.http.get<any[]>(`${this.apiUrl}/recipes/${recipeId}/comments`);
//   }

//   likeRecipe(recipeId: string): Observable<any> {
//     return this.http.patch(`${this.apiUrl}/recipes/${recipeId}`, { $inc: { likes: 1 } });
//   }

//   getTopRecipes(limit: number = 5): Observable<any[]> {
//     return this.http.get<any[]>(`${this.apiUrl}/recipes?_sort=likes&_order=desc&_limit=${limit}`);
//   }

//   getRecipeById(id: string): Observable<any> {
//   return this.http.get<any>(`${this.apiUrl}/recipes/${id}`).pipe(
//     catchError(err => {
//       console.error('Error fetching recipe:', err);
//       return throwError(() => new Error('Failed to fetch recipe'));
//     })
//   );
// }
// }
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, switchMap, throwError } from 'rxjs';

interface Recipe {
  id: string;
  name: string;
  cuisine: string;
  dietType: string;
  ingredients: string[];
  instructions: string;
  prepTime: number;
  image?: string;
  likes?: number;
  comments?: Comment[];
}

interface Comment {
  id?: string;
  userId: string;
  text: string;
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl = 'http://localhost:3000'; 

  constructor(private http: HttpClient) {}

  // Get filtered recipes
  getFilteredRecipes(
    selectedIngredients: string[] = [],
    selectedCuisine: string = 'All',
    dishQuery: string = '',
    selectedDietType: string = ''
  ): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.apiUrl}/recipes`).pipe(
      map(recipes => recipes.filter(recipe => {
        const matchesCuisine = selectedCuisine === 'All' || 
          recipe.cuisine.toLowerCase() === selectedCuisine.toLowerCase();
        
        const matchesDishName = dishQuery.trim() === '' || 
          recipe.name.toLowerCase().includes(dishQuery.toLowerCase());
        
        const matchesDietType = selectedDietType === '' || 
          recipe.dietType === selectedDietType;

        const matchedIngredients = selectedIngredients.length === 0 ? true : 
          selectedIngredients.some(ing =>
            recipe.ingredients.map(i => i.toLowerCase()).includes(ing.toLowerCase())
          );

        return matchesCuisine && matchesDishName && matchesDietType && matchedIngredients;
      })),
      catchError(this.handleError)
    );
  }

  addRecipe(recipe: Omit<Recipe, 'id'>): Observable<Recipe> {
    return this.http.post<Recipe>(`${this.apiUrl}/recipes`, recipe)
      .pipe(catchError(this.handleError));
  }

  addComment(recipeId: string, comment: Omit<Comment, 'id'>): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/recipes/${recipeId}/comments`, comment)
      .pipe(catchError(this.handleError));
  }

  getComments(recipeId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/recipes/${recipeId}/comments`)
      .pipe(catchError(this.handleError));
  }

  likeRecipe(recipeId: string): Observable<Recipe> {
    // First get current likes, then increment
    return this.http.get<Recipe>(`${this.apiUrl}/recipes/${recipeId}`).pipe(
      switchMap(recipe => {
        const updatedRecipe = {
          ...recipe,
          likes: (recipe.likes || 0) + 1
        };
        return this.http.put<Recipe>(`${this.apiUrl}/recipes/${recipeId}`, updatedRecipe);
      }),
      catchError(this.handleError)
    );
  }

  getTopRecipes(limit: number = 5): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(
      `${this.apiUrl}/recipes?_sort=likes&_order=desc&_limit=${limit}`
    ).pipe(catchError(this.handleError));
  }

  getRecipeById(id: string): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.apiUrl}/recipes/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error(
      'Something went wrong; please try again later.'
    ));
  }

}