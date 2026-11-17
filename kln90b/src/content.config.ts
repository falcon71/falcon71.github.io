import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
	docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
	// The field explanations of the generated screens: screens/<id>/fields.mdx, with the folder's path below screens/
	// (packages included, "pages/apt/apt-1-ksea") as its id
	screenFields: defineCollection({
		loader: glob({ pattern: '**/fields.mdx', base: './screens', generateId: ({ entry }) => entry.replace(/\/fields\.mdx$/, '') }),
	}),
};
