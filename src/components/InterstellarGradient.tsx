import React, { Suspense, Component, ReactNode } from 'react';
import { ShaderGradientCanvas, ShaderGradient } from '@shadergradient/react';
import * as reactSpring from '@react-spring/three';

// This import is required for ShaderGradient to work properly
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _ = reactSpring;

// Error boundary to catch WebGL/Three.js crashes
class ShaderErrorBoundary extends Component<
    { children: ReactNode; fallback?: ReactNode },
    { hasError: boolean }
> {
    constructor(props: { children: ReactNode; fallback?: ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.warn('ShaderGradient failed to render:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback ?? null;
        }
        return this.props.children;
    }
}

// Fallback gradient using CSS (shown when WebGL fails)
const FallbackGradient: React.FC = () => (
    <div
        style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: -1,
            pointerEvents: 'none',
            background: 'radial-gradient(ellipse at 30% 50%, #2a1a0f 0%, #663300 40%, #0f1a2a 70%, #000000 100%)',
            opacity: 0.4,
        }}
    />
);

const ShaderGradientContent: React.FC = () => (
    <div
        style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: -1,
            pointerEvents: 'none',
        }}
    >
        <ShaderGradientCanvas
            style={{
                width: '100%',
                height: '100%',
            }}
        >
            <ShaderGradient
                animate="on"
                brightness={0.3}
                cAzimuthAngle={270}
                cDistance={0.5}
                cPolarAngle={180}
                cameraZoom={15.1}
                color1="#2a1a0f"
                color2="#663300"
                color3="#0f1a2a"
                envPreset="city"
                grain="on"
                lightType="env"
                positionX={-0.1}
                positionY={0}
                positionZ={0}
                reflection={0.2}
                rotationX={0}
                rotationY={130}
                rotationZ={70}
                type="sphere"
                uAmplitude={3.2}
                uDensity={0.8}
                uFrequency={5.5}
                uSpeed={0.3}
                uStrength={0.2}
            />
        </ShaderGradientCanvas>
    </div>
);

export const InterstellarGradient: React.FC = () => {
    return (
        <ShaderErrorBoundary fallback={<FallbackGradient />}>
            <Suspense fallback={<FallbackGradient />}>
                <ShaderGradientContent />
            </Suspense>
        </ShaderErrorBoundary>
    );
};
