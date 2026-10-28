import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, PLATFORM_ID, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements AfterViewInit, OnDestroy {
  @ViewChild('carousel') carousel!: ElementRef;

  eventPhotos = [
    { url: 'assets/acampas2025-1.jpeg', title: 'Atividade de monitoria 2025/1' },
    { url: 'assets/acampas2025-2.jpeg', title: 'Atividade de monitoria 2025/2' },
    { url: 'assets/acampas2026-1.jpeg', title: 'Atividade de monitoria 2026/1' },
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
    const card = el.querySelector<HTMLElement>('.foto-card');
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