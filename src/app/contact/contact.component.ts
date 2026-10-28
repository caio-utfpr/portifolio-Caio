import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { templateTextService } from '../services/templateText.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {

  form: FormGroup;
  isLoading = false;
  dados$: Observable<any>;

  /*TODO: colocar a url do site que eu levantar no web3forms*/
  private apiUrl = 'https://api.web3forms.com/submit';
  private accessKey = 'b929f64a-1d0c-48ea-815f-9abc255a875c';
  
  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private templateText: templateTextService
  ) {
    this.dados$ = this.templateText.templateText$;

    this.form = this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(3)]],
      email: [null, [Validators.required, Validators.email]],
      description: [null]
    });
  }

  async publishTask() {
    if (this.form.get('email')?.invalid) {
      this.toastr.error('E-mail inválido');
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const dados = {
      access_key: this.accessKey,
      subject: 'Nova mensagem do site',
      name: this.form.value.name,
      email: this.form.value.email,
      message: this.form.value.description ?? '',
      date: new Date().toISOString()
    };

    try {
      const res = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(dados)
      });

      const json = await res.json();

      if (json.success) {
        this.toastr.success('Mensagem enviada com sucesso!');
        this.form.reset();
      } else {
        console.error(json);
        this.toastr.error('Não foi possível enviar a mensagem.');
      }

    } catch (error) {
      console.error(error);
      this.toastr.error('Erro ao enviar mensagem.');

    } finally {
      this.isLoading = false;
    }
  }
}