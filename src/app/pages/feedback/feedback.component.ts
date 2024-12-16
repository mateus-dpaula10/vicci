import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FeedbackService } from '../../services/feedback.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ButtonComponent } from '../../components/utils/button/button.component'

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule, MatSelectModule, MatOptionModule, MatFormFieldModule, ReactiveFormsModule, MatButtonModule, MatInputModule, ButtonComponent],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss'
})
export class FeedbackComponent {
  constructor(
    private fb: FormBuilder,
    private allUsers: AuthService,
    private feedbackService: FeedbackService
  ) { }

  students: Observable<any[]> = this.allUsers.fetchUsers
  studentsFiltered: Observable<any[]> = this.students.pipe(
    map(users => users.filter(user => user.role === 'Aluno'))
  )

  feedbackForm: FormGroup
  ratings: number[] = [1, 2, 3, 4, 5]

  ngOnInit(): void {
    this.feedbackForm = this.fb.group({
      student: ['', [Validators.required]],
      rating: [null, [Validators.required]],
      comment: ['', [Validators.required, Validators.maxLength(500)]],
    })
  }

  onSubmit(): void {
    if (this.feedbackForm.valid) {
      this.feedbackService.create(this.feedbackForm.value)
        .then(() => {
          this.feedbackForm.reset()
        })
        .catch((error) => {
          console.error(error)
        })
    } else {
      alert('Formulário inválido!')
    }
  }
}
