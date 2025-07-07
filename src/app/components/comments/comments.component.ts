import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RecipeService } from '../../recipe.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-comments',
  imports: [CommonModule,FormsModule],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css'
})
export class CommentsComponent {
  @Input() recipeId: string = '';
  @Output() commentAdded = new EventEmitter<void>();
  
  comments: any[] = [];
  newComment: string = '';

  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
    this.loadComments();
  }

  loadComments() {
    this.recipeService.getComments(this.recipeId).subscribe(comments => {
      this.comments = comments;
    });
  }

  addComment() {
    if (this.newComment.trim()) {
      const comment = {
        recipeId: this.recipeId,
        userId: 'currentUser', // Replace with actual user
        text: this.newComment,
        date: new Date().toISOString()
      };
      
      this.recipeService.addComment(this.recipeId, comment).subscribe(() => {
        this.newComment = '';
        this.loadComments();
        this.commentAdded.emit();
      });
    }
  }
}
