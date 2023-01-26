/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['pages/**/*.{js,ts,jsx,tsx}', 'components/**/*.{js,ts,jsx,tsx}', 'layout/**/*.{js,ts,jsx,tsx}', 'feature/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            fontSize: {
                xsm: ['13px', '18px'],
            },
            colors: {
                skin: {
                    main: '#db4c3f',
                    dark: '#d1453b',
                },
            },
            zIndex: {
                tooltip: 1001,
                navbar: 1000,
                slider: 900,
            },
            transitionTimingFunction: {
                'delay-in': 'cubic-bezier(1, 0.04, 1, -0.12)',
            },
        },
    },
    plugins: [require('@headlessui/tailwindcss')],
}
