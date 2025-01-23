import flowbitePlugin from 'flowbite/plugin'

import type { Config } from 'tailwindcss';

export default {
    content: ['./src/**/*.{html,js,svelte,ts}', './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                'black-bean': '#2E0E02',
                'seal-brown': '#581908',
                'burnt-umber': '#983628',
                'plum': '#E2AEDD',
                'thistle': '#EBCBF4',
            }
        }
    },

    plugins: [flowbitePlugin]
} as Config;
