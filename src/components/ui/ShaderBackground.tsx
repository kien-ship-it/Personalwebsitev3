import React, { Suspense } from 'react';
import { ShaderGradientCanvas, ShaderGradient } from '@shadergradient/react';

export function ShaderBackground() {
    return (
        <ShaderGradientCanvas
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                pointerEvents: 'none',
            }}
        >
            <Suspense fallback={null}>
                <ShaderGradient
                    type="sphere"
                    animate="on"
                    uSpeed={0.4}
                    uStrength={0.2}
                    uDensity={0.8}
                    uFrequency={5.5}
                    uAmplitude={3.2}
                    positionX={-0.1}
                    positionY={0}
                    positionZ={0}
                    rotationX={0}
                    rotationY={130}
                    rotationZ={70}
                    color1="#2a1a0f"
                    color2="#663300"
                    color3="#0f1a2a"
                    reflection={0.2}
                    brightness={0.3}
                    cAzimuthAngle={270}
                    cPolarAngle={180}
                    cDistance={0.5}
                    cameraZoom={15.1}
                    lightType="env"
                    envPreset="city"
                    grain="on"
                />
            </Suspense>
        </ShaderGradientCanvas>
    );
}
