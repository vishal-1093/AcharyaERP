import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const LazyLoadImageComponent = ({ key, src, defaultImage, alt, width, height }) => (
    <div>
        <LazyLoadImage
            key={key}
            src={src}
            placeholderSrc={defaultImage}
            alt={alt}
            height={height}
            width={width} />
    </div>
);

export default LazyLoadImageComponent;