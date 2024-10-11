// Carousel.tsx
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimationController } from './animation';
import { TransitionController } from './transition';

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

function Banner2({ content, fit = 'contain', delay = 5000, height, backgroundColor }: BannerProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);

  const change = useCallback((value: number) => {
    console.warn('change progress');
    setProgress(value);
  }, []);

  const transitionControl = useMemo(() => new TransitionController(content, 0, setCurrentIndex), [content]);
  const animationControl = useMemo(() => new AnimationController(delay, () => transitionControl.next(), change), [delay, transitionControl, change]);

  function handleImageClick() {
    const currentImage = transitionControl.images[currentIndex];
    if (currentImage.callback) {
      currentImage.callback(currentImage);
      return;
    } 
    
    window.open(currentImage.link, '_blank');
  }

  useEffect(() => {
    if (transitionControl.images.length > 1) {
      animationControl.startAnimations();

      return () => animationControl.clearAnimations();
    }
  }, [animationControl, transitionControl]);

  const next = () => transitionControl.next();
  const prev = () => transitionControl.prev();
  const goTo = (index: number) => transitionControl.goTo(index);

  return (
    <div
      className={styles.carousel}
      style={{ height: `${height}px`, backgroundColor }}
      onMouseEnter={() => animationControl.startAnimations()}
      onMouseLeave={() => animationControl.resumeAnimations()}
    >
      {transitionControl.images.length > 1 && (
        <button
          className={`${styles.carousel__button} ${styles['carousel__button--left']}`}
          onClick={prev}
          aria-label="Previous slide"
        >
          &#8249;
        </button>
      )}
      <div className={styles.carousel__imageContainer}>
        <img
          src={transitionControl.images[currentIndex].imageSrc}
          alt={transitionControl.images[currentIndex].alt}
          className={styles.carousel__image}
          style={{ objectFit: fit }}
          onClick={handleImageClick}
          role="button"
          aria-label={`Carousel image ${currentIndex + 1} of ${transitionControl.images.length}`}
        />
        <div className={styles.carousel__progressBar} style={{ width: `${progress}%` }} />
      </div>
      {transitionControl.images.length > 1 && (
        <button
          className={`${styles.carousel__button} ${styles['carousel__button--right']}`}
          onClick={next}
          aria-label="Next slide"
        >
          &#8250;
        </button>
      )}
      {transitionControl.images.length > 1 && (
        <div className={styles.carousel__indicators} role="tablist" aria-label="Carousel navigation">
          {transitionControl.images.map((_, index) => (
            <span
              key={index}
              className={`${styles.carousel__indicator} ${index === currentIndex ? styles.active : ''}`}
              onClick={() => goTo(index)}
              role="tab"
              aria-selected={index === currentIndex}
              aria-label={`Slide ${index + 1}`}
              tabIndex={0}
            />
          ))}
        </div>
      )}
      <div>
        {progress}
      </div>
    </div>
  );
};

export default Banner2;
