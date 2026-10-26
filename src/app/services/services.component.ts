import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, PLATFORM_ID, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements AfterViewInit, OnDestroy {
  services = [
    {
      number: '01',
      title: 'Sites e Sistemas Web',
      description: 'Construímos e mantemos sites e sistemas web sob medida, modernos, responsivos e com suporte contínuo para acompanhar o crescimento do seu negócio.',
      flipped: false
    },
    {
      number: '02',
      title: 'Sistemas Legados',
      description: 'Melhoramos e damos manutenção em sistemas antigos, corrigindo falhas e modernizando o que já existe sem parar a sua operação.',
      flipped: false
    },
    {
      number: '03',
      title: 'E-mail, Domínio e Hospedagem',
      description: 'Configuramos e mantemos e-mail corporativo, domínio e hospedagem, deixando a base digital da sua empresa no ar e monitorada.',
      flipped: false
    },
    {
      number: '04',
      title: 'Aplicativos Mobile',
      description: 'Desenvolvemos e evoluímos aplicativos mobile, do protótipo à publicação, com foco em usabilidade e desempenho.',
      flipped: false
    },
    {
      number: '05',
      title: 'Coleta e Análise de Dados',
      description: 'Coletamos, organizamos e analisamos os dados do seu negócio, transformando informação dispersa em decisões embasadas.',
      flipped: false
    },
    {
      number: '06',
      title: 'Sistemas de Autoatendimento',
      description: 'Criamos sistemas de autoatendimento que reduzem filas e trabalho manual, dando autonomia e agilidade para o seu cliente.',
      flipped: false
    },
    {
      number: '07',
      title: 'Automações',
      description: 'Automatizamos tarefas repetitivas com integrações, APIs e bots, reduzindo trabalho manual e ganhando eficiência.',
      flipped: false
    },
    {
      number: '08',
      title: 'E-commerce',
      description: 'Construímos e evoluímos lojas virtuais completas, com catálogo, pagamento e gestão de pedidos integrados.',
      flipped: false
    }
  ];

  @ViewChild('carousel') carousel!: ElementRef;

  eventPhotos = [
    { url: 'assets/events/foto2.jpg', title: 'Encontro do time Hï Tech' },
    { url: 'assets/events/foto5.jpg', title: 'Hï Tech no palco — Paraná Júnior 2025' },
    { url: 'assets/events/foto6.jpg', title: 'Reconhecimento Palco Ouro — PRJR 2025' },
    { url: 'assets/events/foto7.jpg', title: 'EJ União e Conexão — PRJR 2025' },
    { url: 'assets/events/foto1.jpg', title: 'Paraná Júnior 2026' },
    { url: 'assets/events/foto4.jpg', title: 'Hï Tech no ECOAR — Curitiba Júnior' },
    { url: 'assets/events/foto3.jpg', title: 'Think high, think tech' }
  ];

  private autoplayTimer?: ReturnType<typeof setInterval>;
  private resumeTimer?: ReturnType<typeof setTimeout>;
  private mobileQuery?: MediaQueryList;
  private readonly autoplayIntervalMs = 4000;
  private readonly resumeDelayMs = 8000;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    this.mobileQuery = window.matchMedia('(max-width: 768px)');
    this.mobileQuery.addEventListener('change', this.onBreakpointChange);
    this.syncAutoplay();
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
    if (this.resumeTimer) {
      clearTimeout(this.resumeTimer);
    }
    this.mobileQuery?.removeEventListener('change', this.onBreakpointChange);
  }

  private onBreakpointChange = (): void => this.syncAutoplay();

  private syncAutoplay(): void {
    if (this.mobileQuery?.matches) {
      this.startAutoplay();
    } else {
      this.stopAutoplay();
    }
  }

  private startAutoplay(): void {
    if (this.autoplayTimer) {
      return;
    }
    this.autoplayTimer = setInterval(() => this.advanceCarousel(), this.autoplayIntervalMs);
  }

  private stopAutoplay(): void {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = undefined;
    }
  }

  pauseAutoplay(): void {
    this.stopAutoplay();
    if (this.resumeTimer) {
      clearTimeout(this.resumeTimer);
    }
    this.resumeTimer = setTimeout(() => this.syncAutoplay(), this.resumeDelayMs);
  }

  private advanceCarousel(): void {
    const el = this.carousel?.nativeElement as HTMLElement | undefined;
    if (!el) {
      return;
    }

    const passo = this.cardStep(el);
    const noFim = el.scrollLeft + el.clientWidth >= el.scrollWidth - passo / 2;
    el.scrollTo({ left: noFim ? 0 : el.scrollLeft + passo, behavior: 'smooth' });
  }

  private cardStep(el: HTMLElement): number {
    const card = el.querySelector<HTMLElement>('.event-card');
    if (!card) {
      return el.clientWidth;
    }
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    return card.offsetWidth + gap;
  }

  scrollCarousel(direction: number): void {
    const el = this.carousel?.nativeElement as HTMLElement | undefined;
    if (!el) {
      return;
    }

    this.pauseAutoplay();
    el.scrollBy({ left: direction * this.cardStep(el), behavior: 'smooth' });
  }
}