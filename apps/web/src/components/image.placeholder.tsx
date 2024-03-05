'use client';
import Image from 'next/image';
import { useState } from 'react';

export default function ImagePlaceholder({ primaryImagePath, alt}: { primaryImagePath: string, alt: string}) {
    const [imageLoadError, setImageLoadError] = useState(false);

    primaryImagePath = imageLoadError ? '/images/placeholder.jpg' : primaryImagePath;

    return (
        <div className=''>
            <Image src={primaryImagePath} alt={alt} width={100} height={100} onError={() => setImageLoadError(true)} />
        </div>
    )
}