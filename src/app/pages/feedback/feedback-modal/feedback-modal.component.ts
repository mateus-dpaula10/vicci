import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { FeedbackService } from '../../../services/feedback.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, Observable } from 'rxjs';
import { ButtonComponent } from '../../../components/utils/button/button.component';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-feedback-modal',
  standalone: true,
  imports: [ButtonComponent, CommonModule, MatSelectModule, MatOptionModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatDialogModule],
  templateUrl: './feedback-modal.component.html',
  styleUrl: './feedback-modal.component.scss'
})
export class FeedbackModalComponent {
  private fb = inject(FormBuilder)
  private allUsers = inject(AuthService)
  private feedbackService = inject(FeedbackService)
  private snackbar = inject(MatSnackBar) 
  
  constructor(
    public dialogRef: MatDialogRef<FeedbackModalComponent>,
  ) { }

  students: Observable<any[]> = this.allUsers.fetchUsers
  studentsFiltered: Observable<any[]> = this.students.pipe(
    map(users => users.filter(user => user.role === 'Aluno'))
  )

  feedbackForm: FormGroup
  ratings: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  ngOnInit(): void {
    this.feedbackForm = this.fb.group({
      student: ['', [Validators.required]],
      rating_appliances: [null, [Validators.required]],
      rating_cleaning: [null, [Validators.required]],
      rating_service: [null, [Validators.required]],
      rating_recommendation: [null, [Validators.required]],
      comment: ['', [Validators.required, Validators.maxLength(500)]],
    })
  }

  onSubmit(): void {
    if (this.feedbackForm.invalid) {
      this.snackbar.open("Preencha todos os campos corretamente!", 'Fechar', { duration: 3000 })
      return 
    }

    const payload = this.feedbackForm.value

    this.feedbackService.create(payload)
      .then(result => {
        this.dialogRef.close(result)
        this.snackbar.open("Feedback registrado com sucesso!", 'Fechar', { duration: 3000 })
      })
      .catch((error) => {
        console.error(error)
        this.snackbar.open(error, 'Fechar', { duration: 3000 })
      })
  }
}
