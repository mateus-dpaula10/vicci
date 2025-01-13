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
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-feedback-modal',
  standalone: true,
  imports: [ButtonComponent, CommonModule, MatSelectModule, MatOptionModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatDialogModule, MatDatepickerModule],
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
  currentUser: any | null = null
  anonimous_feedback: boolean = true

  async ngOnInit() {
    this.feedbackForm = this.fb.group({
      student: [''],
      date: ['', Validators.required],
      rating_appliances: ['', Validators.maxLength(500)],
      rating_cleaning: ['', Validators.maxLength(500)],
      rating_service: ['', Validators.maxLength(500)],
      rating_recommendation: ['', Validators.maxLength(500)],
      comment: ['', Validators.maxLength(500)],
    })

    this.loadUser()
  }

  async loadUser(): Promise<void> {
    try {
      this.currentUser = await this.allUsers.getCurrentUser()
    } catch (error) {
      console.error('Erro ao carregar usuário logado: ', error)
      this.currentUser = null
    }
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
