import { useEffect } from 'react';

interface ScrollAnimationProps {
  children: React.ReactNode;
  className?: string;
  animation?: string; // Tipo de animação do AOS
  duration?: number; // Duração da animação em ms
  delay?: number; // Delay em ms
  offset?: number; // Offset em pixels
  easing?: string; // Tipo de easing
  anchor?: string; // Âncora para o elemento
  anchorPlacement?: string; // Posicionamento da âncora
  once?: boolean; // Se a animação deve ocorrer apenas uma vez
}

export function ScrollAnimation({
  children,
  className = '',
  animation = 'fade-up',
  duration = 600,
  delay = 0,
  offset = 120,
  easing = 'ease-out-cubic',
  anchor,
  anchorPlacement,
  once = false
}: ScrollAnimationProps) {
  // Converter props para atributos data do AOS
  const aosProps = {
    'data-aos': animation,
    'data-aos-duration': duration.toString(),
    'data-aos-delay': delay.toString(),
    'data-aos-offset': offset.toString(),
    'data-aos-easing': easing,
    'data-aos-once': once.toString(),
    ...(anchor && { 'data-aos-anchor': anchor }),
    ...(anchorPlacement && { 'data-aos-anchor-placement': anchorPlacement })
  };

  return (
    <div className={className} {...aosProps}>
      {children}
    </div>
  );
}