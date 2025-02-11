import { Component, inject } from '@angular/core';
import { ButtonComponent } from '../../components/utils/button/button.component';
import { MatButtonModule } from '@angular/material/button';
import { HelpService } from '../../services/help.service';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { map, Observable } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-help',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  standalone: true,
  imports: [
    ButtonComponent,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    FormsModule,
    MatInputModule,
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule
  ],
  templateUrl: './help.component.html',
  styleUrl: './help.component.scss'
})
export class HelpComponent {
  private helpService = inject(HelpService)
  private snackbar = inject(MatSnackBar)
  private fb = inject(FormBuilder)
  private authService = inject(AuthService)

  user: any | null = null
  helpsList$ = this.helpService.helps
  helpsList: FormGroup
  displayedColumns: string[] = ['name', 'category', 'priority', 'question_information']
  dataSource: MatTableDataSource<any> = new MatTableDataSource()
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand']
  expandedElement: any
  categories: any[] = ['Suporte Técnico', 'Consultoria', 'Dúvidas Gerais']
  priorities: any[] = ['Baixa', 'Média', 'Alta']

  constructor() {
    this.helpsList = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      category: ['', Validators.required],
      priority: ['', Validators.required],
      question_information: ['', Validators.required]
    })
  }

  async ngOnInit() {
    this.loadUser()
  }

  async loadUser(): Promise<void> {
    try {
      this.user = await this.authService.getCurrentUser()
      if (this.user) {
        this.helpsList.patchValue({
          name: this.user.name,
          email: this.user.email
        })
      }
    } catch (error) {
      console.error('Erro ao carregar usuário logado: ', error)
      this.user = null
    }
  }

  sendRequest() {
    const payload = this.helpsList.value

    if (this.helpsList.valid) {
      this.helpService.create(payload)
        .then(() => {
          this.snackbar.open("Solicitação enviada com sucesso!", 'Fechar', { duration: 3000 })

          const emailBody = `
            Olá time de suporte da Ftech,

            ${payload.name} com e-mail ${payload.email} envia-lhe uma solicitação com os seguintes dados:
            
            Categoria: ${payload.category}
            Prioridade: ${payload.priority}
            Dúvida ou informações: ${payload.question_information}

            Aguarda-se retorno!
          `

          this.helpService
            .sendEmail('mateus.dpaula10@gmail.com', 'Solicitação de suporte Vicci!', emailBody)            
            .subscribe(
              () => this.snackbar.open("Notificação enviada por e-mail!", 'Fechar', { duration: 3000 }),
              (error) => this.snackbar.open("Erro ao enviar email: " + error.message, 'Fechar', { duration: 3000 })
            )

          this.helpsList.reset()
        })
        .catch((error) => this.snackbar.open(error.message, 'Fechar', { duration: 3000 }))
    }
  }

  onSubmit(
    id: any,
    name: any,
    category: any,
    priority: any,
    question_information: any
  ) {
    const payload = {
      name: name.value,
      category: category.value,
      priority: priority.value,
      question_information: question_information.value
    }

    this.helpService.update(id, payload)
      .then(() => this.snackbar.open("Solicitação atualizada com sucesso!", 'Fechar', { duration: 3000 }))
      .catch((error) => this.snackbar.open(error.message, 'Fechar', { duration: 3000 }))
  }

  onDelete(id: any) {
    const snackbarRef = this.snackbar.open("Deseja excluir convite?", 'Excluir', { duration: 3000 })
    snackbarRef.onAction().subscribe(() => {
      this.helpService.delete(id)
        .then(() => this.snackbar.open("Solicitação excluída com sucesso!", 'Fechar', { duration: 3000 }))
        .catch((error) => this.snackbar.open(error.message, 'Fechar', { duration: 3000 }))
    })
  }
}
