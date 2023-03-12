/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        'pages/**/*.{js,ts,jsx,tsx}',
        'components/**/*.{js,ts,jsx,tsx}',
        'layout/**/*.{js,ts,jsx,tsx}',
        'feature/**/*.{js,ts,jsx,tsx}',
        'context/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            fontSize: {
                xsm: ['0.8125rem', '1.125rem'],
            },
            colors: {
                skin: {
                    main: '#db4c3f',
                    dark: '#d1453b',
                },
            },
            zIndex: {
                alert: 1000,
            },
        },
    },
    plugins: [],
}
