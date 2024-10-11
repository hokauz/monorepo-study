// Carousel.tsx
import { useEffect, useMemo, useState } from 'react';
import styles from './Banner.module.scss';

interface BannerProps {
  height: number;
  fit?: 'contain' | 'cover';
  delay?: number; // tempo de passagem entre as imagens em milesegundos
  backgroundColor?: string;
  content: BannerContent[];
};

interface BannerContent {
  link: string;
  alt: string;
  imageSrc: string;
  callback?: (content: BannerContent) => void;
  order?: number;
}

class CarouselController {
  sortedImages: BannerContent[];
  intervalRef: number | null = null;
  progressRef: number | null = null;
  delay: number;
  setCurrentIndex: (index: number) => void;
  setProgress: (progress: number | ((progress: number) => number)) => void;

  constructor(
    images: BannerContent[],
    delay: number,
    setCurrentIndex: (index: number) => void,
    setProgress: (progress: number | ((progress: number) => number)) => void,
  ) {
    this.sortedImages = this.sortImages(images);
    this.delay = delay;
    this.setCurrentIndex = setCurrentIndex;
    this.setProgress = setProgress;
  }

  sortImages(images: BannerContent[]): BannerContent[] {
    return images.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }

  startAutoSlide(callback?: () => void) {
    this.intervalRef = window.setInterval(() => callback && callback(), this.delay);
  }

  stopAutoSlide() {
    if (this.intervalRef) {
      clearInterval(this.intervalRef);
    }
  }

  startProgress() {
    // Inicializa a barra de progresso do carrossel em 0
    this.setProgress(0);
    // Atualiza a barra de progresso a cada 100 ms, incrementando o valor atual até 100%
    this.progressRef = window.setInterval(() => {
      this.setProgress((progress: number) => Math.min(progress + (100 / (this.delay / 100)), 100));
    }, 100);
  }

  stopProgress() {
    if (this.progressRef) {
      clearInterval(this.progressRef);
    }
  }

  getNextIndex(currentIndex: number): number {
    return (currentIndex + 1) % this.sortedImages.length;
  }

  getPrevIndex(currentIndex: number): number {
    return currentIndex === 0 ? this.sortedImages.length - 1 : currentIndex - 1;
  }
}

function Banner({ content, fit = 'contain', delay = 5000, height, backgroundColor }: BannerProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  
  const controller = useMemo(() => new CarouselController(content, delay, setCurrentIndex, setProgress), [content, delay]);

  function handleImageClick() {
    const currentImage = controller.sortedImages[currentIndex];
    if (currentImage.callback) {
      currentImage.callback(currentImage);
      return;
    } 
    
    window.open(currentImage.link, '_blank');
  }

  useEffect(() => {
    if (controller.sortedImages.length > 1) {
      controller.startAutoSlide(() => {
        setCurrentIndex(controller.getNextIndex(currentIndex));
      });

      return () => controller.stopAutoSlide();
    }
  }, [controller, currentIndex]);

  useEffect(() => {
    if (controller.sortedImages.length > 1) {
      controller.startProgress();
      return () => controller.stopProgress();
    }
  }, [currentIndex, controller]);

  function nextImage() {
    setCurrentIndex(controller.getNextIndex(currentIndex));
  }

  function prevImage() {
    setCurrentIndex(controller.getPrevIndex(currentIndex));
  }

  function goToImage(index: number) {
    setCurrentIndex(index);
  }

  return (
    <div
      className={styles.carousel}
      style={{ height: `${height}px`, backgroundColor }}
      onMouseEnter={() => controller.stopAutoSlide()}
      onMouseLeave={() => controller.startAutoSlide()}
    >
      {controller.sortedImages.length > 1 && (
        <button
          className={`${styles.carousel__button} ${styles['carousel__button--left']}`}
          onClick={prevImage}
          aria-label="Previous slide"
        >
          &#8249;
        </button>
      )}
      <div className={styles.carousel__imageContainer}>
        <img
          src={controller.sortedImages[currentIndex].imageSrc}
          alt={controller.sortedImages[currentIndex].alt}
          className={styles.carousel__image}
          style={{ objectFit: fit }}
          onClick={handleImageClick}
          role="button"
          aria-label={`Carousel image ${currentIndex + 1} of ${controller.sortedImages.length}`}
        />
        <div className={styles.carousel__progressBar} style={{ width: `${progress}%` }} />
      </div>
      {controller.sortedImages.length > 1 && (
        <button
          className={`${styles.carousel__button} ${styles['carousel__button--right']}`}
          onClick={nextImage}
          aria-label="Next slide"
        >
          &#8250;
        </button>
      )}
      {controller.sortedImages.length > 1 && (
        <div className={styles.carousel__indicators} role="tablist" aria-label="Carousel navigation">
          {controller.sortedImages.map((_, index) => (
            <span
              key={index}
              className={`${styles.carousel__indicator} ${index === currentIndex ? styles.active : ''}`}
              onClick={() => goToImage(index)}
              role="tab"
              aria-selected={index === currentIndex}
              aria-label={`Slide ${index + 1}`}
              tabIndex={0}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Banner;
