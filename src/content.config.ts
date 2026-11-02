import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import type { ImageFunction } from 'astro/content/config';

const shows = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/shows' }),
  schema: ({ image }: { image: ImageFunction }) =>
    z.object({
      date: z.coerce.date(),          
      city: z.string(),
      venue: z.string(),
      status: z.enum(['announced', 'soldout', 'cancelled']).default('announced'),
      ticketUrl: z.string().optional(), 
      title: z.string().optional(),
      time: z.string().optional(),
      poster: image().optional(),
      description: z.string().optional(),
    }),
});

const tracks = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/tracks' }),
  schema: z.object({
    title: z.string(),
    order: z.number(), 
    audioFile: z.string(),
    cover: z.object({
      src: z.string(),
    }).optional()
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
  }),
});

const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: ({ image }: { image: ImageFunction }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      cover: image().optional(),
    }),
});

const members = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/members' }),
  schema: ({ image }: { image: ImageFunction }) =>
    z.object({
      name: z.string(),
      role: z.string(),
      order: z.number(),
      photo: z.string().optional(),
      quote: z.string().optional(),
      photoHome: z.string().optional(),
    }),
});

const contacts = defineCollection({
  loader: glob({ pattern: 'contacts.md', base: './src/content' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    bookingEmail: z.string().optional(),
    bookingPhone: z.string().optional(),
    pressEmail: z.string().optional(),
    riderUrl: z.string().optional(),
    pressKitUrl: z.string().optional(),
    offerUrl: z.string().optional(),
    photo: z.string().optional(),
  }),
});

export const collections = { shows, pages, news, tracks, members, contacts };

