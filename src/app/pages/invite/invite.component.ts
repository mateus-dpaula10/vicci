import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ButtonComponent } from '../../components/utils/button/button.component';
import { InviteService } from '../../services/invite.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { EmailService } from '../../services/email.service';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-invite',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatDatepickerModule, 
    ButtonComponent, 
    CommonModule, 
    MatTableModule, 
    MatIconModule, 
    FormsModule, 
    MatSelectModule, 
    MatOptionModule,
    NgxMaskDirective,
    HttpClientModule,
    MatButtonModule
  ],
  templateUrl: './invite.component.html',
  styleUrl: './invite.component.scss',
  providers: [provideNgxMask()]
})
export class InviteComponent {
  inviteForm: FormGroup
  user: any | null = null  
  invitesPending$: Observable<any[]> = this.inviteService.invites.pipe(
    map(invites => invites.filter(invite => invite.status === 'pendente' || invite.status === 'aprovado'))
  )
  inviteStatus: any = ['pendente', 'aprovado']
 
  displayedColumns: string[] = ['name', 'email', 'cellphone', 'indicatedBy', 'status'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource()
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand']
  expandedElement: any

  constructor(
    private fb: FormBuilder,
    private inviteService: InviteService,
    private snackbar: MatSnackBar,
    private usersService: AuthService,
    private emailService: EmailService,
    private authService: AuthService
  ) {
    this.inviteForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cellphone: ['', Validators.required],
      // date: ['', Validators.required],
      // hour: ['', Validators.required],
    })
  }

  ngOnInit(): void {
    this.loadUser()    
  }

  async loadUser(): Promise<void> {
    try {
      this.user = await this.usersService.getCurrentUser()
    } catch (error) {
      console.error('Erro ao carregar usuário logado: ', error)
      this.user = null
    }
  }

  sendInvite() {
    if (this.inviteForm.valid) {      
      this.inviteService.submit(this.inviteForm.value, this.user)
        .then(() => {
          this.snackbar.open("Convite enviado com sucesso!", 'Fechar', { duration: 3000 })
          this.inviteForm.reset()
        })
        .catch((error) => this.snackbar.open(error.message, 'Fechar', { duration: 3000 }))
    }
  }

  onSubmit(
    id: any,
    name: any,
    email: any,
    cellphone: any,
    indicatedBy: any,
    status: any
  ) {
    const payload = {
      name: name.value,
      email: email.value,
      cellphone: cellphone.value,
      indicatedBy: indicatedBy.value,
      status: status.value
    }

    this.inviteService
      .update(id, payload)
      .then(() => {
        this.snackbar.open("Convite atualizado com sucesso!", 'Fechar', { duration: 3000 })

        if (payload.status === 'aprovado') {
          const emailBody = `
            Olá ${payload.name},

            Você foi indicado pelo aluno ${payload.indicatedBy} a visitar e conhecer nossa academia.
            
            Seu convite foi aprovado! Estamos ansiosos para receber você.
            
            Endereço: 

            Atenciosamente,
            Equipe Vicci Studio.
          `

          this.authService.registerUser(payload.name, payload.email)

          this.emailService
            .sendEmail(payload.email, 'Convite aprovado!', emailBody)
            .subscribe(
              () => this.snackbar.open("Notificação enviada por e-mail!", 'Fechar', { duration: 3000 }),
              (error) => this.snackbar.open("Erro ao enviar email: " + error.message, 'Fechar', { duration: 3000 })
            )
        }
      })
      .catch((error) => this.snackbar.open(error.message, 'Fechar', { duration: 3000 }))
  }

  onDelete(id: any) {
    const snackbarRef = this.snackbar.open("Deseja excluir convite?", 'Excluir', { duration: 3000 })
    snackbarRef.onAction().subscribe(() => {
      this.inviteService.delete(id)
        .then(() => this.snackbar.open("Convite excluído com sucesso!", 'Fechar', { duration: 3000 }))
        .catch((error) => this.snackbar.open(error.message, 'Fechar', { duration: 3000 }))
    })
  }
}
