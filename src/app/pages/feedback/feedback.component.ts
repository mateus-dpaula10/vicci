import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FeedbackModalComponent } from './feedback-modal/feedback-modal.component';
import { ButtonComponent } from '../../components/utils/button/button.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AsyncPipe } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { FeedbackService } from '../../services/feedback.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-feedback',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  standalone: true,
  imports: [MatButtonModule, MatTableModule, ButtonComponent, MatIconModule, MatInputModule, FormsModule, AsyncPipe, MatFormFieldModule],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss'
})
export class FeedbackComponent {  
  private dialog = inject(MatDialog)
  private snackbar= inject(MatSnackBar)  
  private feedbackService = inject(FeedbackService)
  private allStudents = inject(AuthService)

  feedbacks$ = this.feedbackService.feedbacks
  currentUser: any | null = null

  displayedColumns: string[] = ['student', 'date']
  dataSource: MatTableDataSource<any> = new MatTableDataSource()  
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand']
  expandedElement: any

  openDialog(): void {
    const dialogRef = this.dialog.open(FeedbackModalComponent)

    dialogRef.afterClosed().subscribe(res => {
      if (!res) return
      this.dataSource.data.push(res)
      this.dataSource = new MatTableDataSource(this.dataSource.data)
      this.snackbar.open("Feedback registrado com sucesso!", 'Fechar', { duration: 3000 })
    })
  }

  async ngOnInit() {
    this.loadUser()
  }

  async loadUser(): Promise<void> {
    try {
      this.currentUser = await this.allStudents.getCurrentUser()
    } catch (error) {
      console.error('Erro ao carregar usuário logado: ', error)
      this.currentUser = null
    }
  }

  // onSubmit(
  //   id: any,
  //   student: any,
  //   date: any,
  //   rating_appliances: any,
  //   rating_cleaning: any,
  //   rating_recommendation: any,
  //   rating_service: any,
  //   comment: any
  // ) {
  //   this.feedbackService.update(id, {
  //     student: student.value,
  //     date: date.value,
  //     rating_appliances: rating_appliances.value,
  //     rating_cleaning: rating_cleaning.value,
  //     rating_recommendation: rating_recommendation.value,
  //     rating_service: rating_service.value,
  //     comment: comment.value
  //   }) 
  //     .then(() => this.snackbar.open("Feedback atualizado com sucesso!", 'Fechar', { duration: 3000 }))
  //     .catch(() => this.snackbar.open("Erro ao atualizar.", 'Fechar', { duration: 3000 }))
  // }

  onDelete(id: any) {
    const snackbarRef = this.snackbar.open("Deseja excluir feedback?", 'Excluir', { duration: 3000 })
    snackbarRef.onAction().subscribe(() => {
      this.feedbackService.delete(id) 
        .then(() => this.snackbar.open("Feedback excluído com sucesso!", 'Fechar', { duration: 3000 }))
        .catch(() => this.snackbar.open("Erro ao excluir.", 'Fechar', { duration: 3000 }))
    })
  }
}
