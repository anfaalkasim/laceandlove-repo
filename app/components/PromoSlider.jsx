import {useState, useEffect, useRef} from 'react';
import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';

/**
 * PromoSlider renders an interactive image slider from Shopify Metaobjects.
 * @param {{
 *   slides: Array<any>;
 * }}
 */
export function PromoSlider({slides = []}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoplayTimerRef = useRef(null);

  const startAutoplay = () => {
    stopAutoplay();
    if (slides.length > 1) {
      autoplayTimerRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
      }, 5000); // Transitions slide every 5 seconds
    }
  };

  const stopAutoplay = () => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
    }
  };

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, [slides.length]);

  if (!slides || slides.length === 0) {
    return null;
  }

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
    startAutoplay();
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    startAutoplay();
  };

  const handleDotClick = (index, e) => {
    e.stopPropagation();
    setCurrentIndex(index);
    startAutoplay();
  };

  return (
    <div
      className="promo-slider-container"
      onMouseEnter={stopAutoplay}
      onMouseLeave={startAutoplay}
    >
      <div
        className="promo-slider-track"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {slides.map((slide, index) => {
          const imageObj = slide.image?.reference?.image;
          const destination = slide.linkUrl?.value || '/collections';

          if (!imageObj) return null;

          const isExternal =
            destination.startsWith('http://') ||
            destination.startsWith('https://');

          const slideContent = (
            <div className="promo-slide-image-wrapper">
              <Image
                data={imageObj}
                sizes="100vw"
                className="promo-slide-image"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            </div>
          );

          return (
            <div key={slide.id || index} className="promo-slide">
              {isExternal ? (
                <a
                  href={destination}
                  className="promo-slide-link"
                >
                  {slideContent}
                </a>
              ) : (
                <Link to={destination} className="promo-slide-link">
                  {slideContent}
                </Link>
              )}
            </div>
          );
        })}
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            className="promo-slider-arrow prev"
            onClick={handlePrev}
            aria-label="Previous promotional slide"
          >
            &#10094;
          </button>
          <button
            type="button"
            className="promo-slider-arrow next"
            onClick={handleNext}
            aria-label="Next promotional slide"
          >
            &#10095;
          </button>

          <div className="promo-slider-pagination">
            <span className="promo-slider-counter">
              {currentIndex + 1}/{slides.length}
            </span>
            <div className="promo-slider-dots">
              {slides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={`promo-slider-dot ${
                    index === currentIndex ? 'active' : ''
                  }`}
                  onClick={(e) => handleDotClick(index, e)}
                  aria-label={`Go to promotional slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
