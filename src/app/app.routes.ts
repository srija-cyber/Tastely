import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { FeedbackComponent } from './pages/feedback/feedback.component';
import { RecipeFormComponent } from './components/recipe-form/recipe-form.component';
import { RecipeDetailComponent } from './components/recipe-detail/recipe-detail.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { UserDishesComponent } from './components/user-dishes/user-dishes.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './auth.guard';
import { UserLoginComponent } from './pages/user-login/user-login.component';

export const routes: Routes = [
  // Public routes
  // { path: 'login', component: LoginComponent,data: { hideNavbar: true } },
  { path: 'user-login', component: UserLoginComponent,data: { hideNavbar: true } },
  { path: 'about', component: AboutUsComponent },
  { path: '', component: HomeComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'favorites', component: FavoritesComponent, canActivate: [AuthGuard] },
    { path: 'contact', component: ContactUsComponent, canActivate: [AuthGuard]},
  { path: 'userdishes', component: UserDishesComponent, canActivate: [AuthGuard] },
  { path: 'feedback', component: FeedbackComponent, canActivate: [AuthGuard] },
  // { path: 'recipe/:id', component: RecipeDetailComponent, canActivate: [AuthGuard] },
  { path: 'share-recipe', component: RecipeFormComponent, canActivate: [AuthGuard] },
  
  // Fallback route
  { path: '**', redirectTo: 'user-login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }