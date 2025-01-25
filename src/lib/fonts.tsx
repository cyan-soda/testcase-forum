import localFont from 'next/font/local'

export const SourceSansPro = localFont({
    src: [
        {
            path: '../../public/fonts/SourceSansPro-ExtraLight.woff2',
            weight: '200',
            style: 'extra-light',
        },
        {
            path: '../../public/fonts/SourceSansPro-Light.woff2',
            weight: '300',
            style: 'light',
        },
        {
            path: '../../public/fonts/SourceSansPro-Regular.woff2',
            weight: '400',
            style: 'regular',
        },
        {
            path: '../../public/fonts/SourceSansPro-Semibold.woff2',
            weight: '600',
            style: 'semibold',
        },
        {
            path: '../../public/fonts/SourceSansPro-Bold.woff2',
            weight: '700',
            style: 'bold',
        },
        {
            path: '../../public/fonts/SourceSansPro-Black.woff2',
            weight: '900',
            style: 'black',
        }
    ],
    display: 'swap',
    variable: '--font-source-sans-pro',
})