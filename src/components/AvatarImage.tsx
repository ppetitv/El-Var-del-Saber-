import React from 'react';

interface AvatarImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function AvatarImage({ src, alt, className = '' }: AvatarImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={`h-full w-full rounded-full object-cover ${className}`.trim()}
      loading="lazy"
      decoding="async"
    />
  );
}
