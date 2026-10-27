import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ServicesComponent } from './services/services.component';
import { ContactComponent } from './contact/contact.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    component: HomeComponent,
    data: {
      seo: {
        title: 'Página inicial',
        description:
          'Desenvolvo sites, sistemas web, automações e design de produto.',
      },
    },
  },
  {
    path: 'about',
    component: AboutComponent,
    data: {
      seo: {
        title: 'Sobre Mim',
        description:
          'Conheça um pouco sobre minha trajetória, trabalho e gostos',
      },
    },
  },
  {
    path: 'services',
    component: ServicesComponent,
    data: {
      seo: {
        title: 'Trabalhos',
        description:
          'Conheça os trabalhos que eu já fiz',
      },
    },
  },
  {
    path: 'contact',
    component: ContactComponent,
    data: {
      seo: {
        title: 'Contato',
        description:
          'Envie uma mensagem para mim',
      },
    },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled', useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
