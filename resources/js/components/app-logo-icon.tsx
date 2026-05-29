import type { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img {...props} src="/images/bongomaker.png" alt={props.alt ?? 'BongoMaker logo'} />
    );
}
