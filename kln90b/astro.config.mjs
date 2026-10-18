// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { unified } from '@astrojs/markdown-remark';
import remarkPageLinks from './src/plugins/remarkPageLinks';

// The manual is served from https://falcon71.github.io/kln90b/
export default defineConfig({
	site: 'https://falcon71.github.io',
	base: '/kln90b',
	trailingSlash: 'always',
	markdown: {
		// The remark pipeline, for the plugin that links every page name in the text to the page reference
		processor: unified({ remarkPlugins: [[remarkPageLinks, { base: '/kln90b' }]] }),
	},
	integrations: [
		starlight({
			title: 'KLN 90B Simulator Manual',
			description: 'Operating manual for the KLN 90B GPS in Microsoft Flight Simulator.',
			favicon: '/favicon.svg',
			credits: false,
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/falcon71/kln90b' },
				{ icon: 'discord', label: 'Discord', href: 'https://discord.gg/ZdQ6htedtT' },
			],
			customCss: [
				'@fontsource/barlow-semi-condensed/500.css',
				'@fontsource/barlow-semi-condensed/600.css',
				'@fontsource-variable/public-sans/index.css',
				'@fontsource-variable/public-sans/wght-italic.css',
				'./src/styles/theme.css',
			],
			components: {
				Footer: './src/components/Footer.astro',
				SiteTitle: './src/components/SiteTitle.astro',
			},
			sidebar: [
				{
					label: 'Getting started',
					items: [
						{ label: 'Installation', slug: 'getting-started/installation' },
						{ label: 'Quickstart', slug: 'getting-started/quickstart' },
						{ label: 'Tutorial flight 1', slug: 'getting-started/tutorial-1' },
						{ label: 'Tutorial flight 2', slug: 'getting-started/tutorial-2' },
					],
				},
				{
					label: 'The unit',
					items: [{ autogenerate: { directory: 'unit' } }],
				},
				{
					label: 'Operation',
					items: [{ autogenerate: { directory: 'operation' } }],
				},
				{
					label: 'Page reference',
					items: [{ autogenerate: { directory: 'pages' } }],
				},
				{
					label: 'Reference lists',
					items: [{ autogenerate: { directory: 'lists' } }],
				},
				{
					label: 'Help',
					items: [
						{ label: 'External hardware', slug: 'help/external-hardware' },
						{ label: 'FAQ and troubleshooting', slug: 'help/faq' },
						{ label: 'Known limitations', slug: 'help/known-limitations' },
						{ label: 'Contact', slug: 'help/contact' },
					],
				},
			],
		}),
	],
});
