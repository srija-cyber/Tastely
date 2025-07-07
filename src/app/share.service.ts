import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShareService {
  shareRecipe(recipe: any): void {
    // Implement sharing logic here
    const shareUrl = `${window.location.origin}/recipe/${recipe.id}`;
    const text = `Check out this recipe for ${recipe.name} on Tastely!`;
    
    if (navigator.share) {
      navigator.share({
        title: recipe.name,
        text: text,
        url: shareUrl
      }).catch(err => {
        console.error('Error sharing:', err);
        this.fallbackShare(shareUrl, text);
      });
    } else {
      this.fallbackShare(shareUrl, text);
    }
  }

  private fallbackShare(url: string, text: string): void {
    // Fallback for browsers that don't support Web Share API
    prompt('Copy this link to share:', url);
  }
}