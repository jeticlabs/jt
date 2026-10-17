import { ReactNode } from "react"

export default function CosmicSparkle({ children, className }: { children: ReactNode, className?: string }) {
    return (
        <div className={`h-full w-full relative ${className}`}>
            {/* Cosmic Sparkle Pattern */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    background: `
        radial-gradient(circle at 50% 50%, rgba(255, 0, 255, 0.08) 0%, transparent 45%),
        radial-gradient(circle at 50% 50%, rgba(0, 255, 255, 0.08) 10%, transparent 55%),
        radial-gradient(circle at 50% 50%, #111 0%, #1a1a1a 100%)
      `,
                    backgroundBlendMode: "soft-light",
                    boxShadow: `inset 0 0 60px rgba(255, 255, 255, 0.3),
        inset 20px 0 80px rgba(255, 0, 255, 0.2),
        inset -20px 0 80px rgba(0, 255, 255, 0.2),
        inset 20px 0 300px rgba(255, 0, 255, 0.1),
        inset -20px 0 300px rgba(0, 255, 255, 0.1),
        0 0 50px rgba(255, 255, 255, 0.1),
        -10px 0 80px rgba(255, 0, 255, 0.1),
        10px 0 80px rgba(0, 255, 255, 0.1)`,
                    filter: "contrast(1.05) brightness(1.05) blur(0.5px)",
                }}
            />
            <div className="relative z-1 h-full w-full">
                {children}
            </div>
        </div>
    )
}