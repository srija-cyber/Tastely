import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'app-share-modal',
  imports:[CommonModule],
  templateUrl: './share-modal.component.html',
  styleUrls: ['./share-modal.component.css']
})
export class ShareModalComponent {
  @Input() recipe: any; // This input must exist
  @Output() close = new EventEmitter<void>();
  shareUrl: string = '';

  ngOnInit() {
    if (this.recipe) {
      this.shareUrl = `${window.location.origin}/recipe/${this.recipe.id}`;
    }
  }
  copyToClipboard() {
    navigator.clipboard.writeText(this.shareUrl);
    // Optional: Add a toast notification that it was copied
  }

  closeModal() {
    this.close.emit();
  }

  shareOnFacebook() {
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.shareUrl)}`;
  window.open(url, '_blank');
  }

  shareOnTwitter() {
    const text = `Check out this recipe for ${this.recipe.name} on Tastely!`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(this.shareUrl)}`;
    window.open(url, '_blank');
  }

  shareOnWhatsApp() {
    const text = `Check out this recipe for ${this.recipe.name}: ${this.shareUrl}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  }
}