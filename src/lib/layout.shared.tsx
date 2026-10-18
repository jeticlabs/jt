import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { JeticIcon } from '@/components/jetic-icon';

export function baseOptions(): BaseLayoutProps {
    return {
        nav: {
            title: (
                <span className="flex items-center gap-2">
                    <JeticIcon size={12} className="fill-current" />
                    <span className="font-semibold tracking-tight">Jetic</span>
                </span>
            ),
        },
        // The docs shell is pinned to the Jetic dark surface, so a light/dark
        // toggle would have nothing to switch.
        themeSwitch: { enabled: false },
    };
}


