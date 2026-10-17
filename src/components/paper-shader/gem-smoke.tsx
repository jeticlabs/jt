import { GemSmoke } from '@paper-design/shaders-react';
import { images } from '@/lib/images';

export default function JeticIcon() {
    return (
        <GemSmoke
            width={800}
            height={720}
            image={images.brand}
            colors={["#fe5b16", "#f7ff61", "#ffffff"]}
            colorBack="#2b0707"
            colorInner="#000000"
            shape={undefined}
            innerDistortion={0.6}
            outerDistortion={0.8}
            outerGlow={0}
            innerGlow={1}
            offset={-1}
            angle={228}
            size={1}
            speed={0.76}
            scale={0.6}
        />
    )
}