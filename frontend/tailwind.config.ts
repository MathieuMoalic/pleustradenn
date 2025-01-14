import flowbitePlugin from 'flowbite/plugin'

import type { Config } from 'tailwindcss';

export default {
    content: ['./src/**/*.{html,js,svelte,ts}', './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primaryBg: '#111827', // gray-900
                secondaryBg: '#1e293b', // gray-800
                primaryText: '#f3f4f6', // gray-100
                inputBorderColor: '#374151', // gray-700
                buttonBg: '#991b1b', // red-800
                primary: {
                    50: '#FFF5F2',
                    100: '#FFF1EE',
                    200: '#FFE4DE',
                    300: '#FFD5CC',
                    400: '#FFBCAD',
                    500: '#FE795D',
                    600: '#EF562F',
                    700: '#EB4F27',
                    800: '#CC4522',
                    900: '#A5371B'
                }
            }
        }
    },

    plugins: [flowbitePlugin]
} as Config;
