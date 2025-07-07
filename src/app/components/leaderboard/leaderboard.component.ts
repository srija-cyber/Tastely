import { Component } from '@angular/core';
import { RecipeService } from '../../recipe.service';

@Component({
  selector: 'app-leaderboard',
  imports: [],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.css'
})
export class LeaderboardComponent {
  topRecipes: any[] = [];

  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
    this.recipeService.getTopRecipes(5).subscribe(recipes => {
      this.topRecipes = recipes;
    });
  }
}