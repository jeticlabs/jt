
export function JeticIcon({ size = 20 }: { size?: number }) {
    // viewBox is 14×21, so height = size * (21/14) = size * 1.5
    return (
        <svg width={size} height={size * 1.5} viewBox="0 0 14 21" fill="white" aria-label="Jetic">
            <path d="M0 0h14v14l-7 7H0v-7h7V7H0V0Z" />
        </svg>
    );
}