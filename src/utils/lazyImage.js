// Utility for lazy loading images
export const lazyLoadImage = (src) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = () => resolve(src);
    img.src = src;
  });
};

// Component wrapper for lazy-loaded images
export const LazyImage = ({ src, alt, className, ...props }) => {
  const [imageSrc, setImageSrc] = React.useState(null);
  const [imageRef, setImageRef] = React.useState(null);

  React.useEffect(() => {
    if (!src) return;

    // Use Intersection Observer for lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImageSrc(src);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '50px' }
    );

    if (imageRef) {
      observer.observe(imageRef);
    }

    return () => {
      if (imageRef) observer.unobserve(imageRef);
    };
  }, [src, imageRef]);

  return (
    <img
      ref={setImageRef}
      src={imageSrc}
      alt={alt}
      className={className}
      {...props}
    />
  );
};
