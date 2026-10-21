import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
	docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
	// The field explanations of the generated screens: screens/<id>/fields.mdx, with the folder name as its id
	screenFields: defineCollection({
		loader: glob({ pattern: '*/fields.mdx', base: './screens', generateId: ({ entry }) => entry.split('/')[0] }),
	}),
};
