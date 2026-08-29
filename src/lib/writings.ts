import "server-only";

import { readdir } from "node:fs/promises";
import path from "node:path";
import type { ComponentType } from "react";
import { z } from "zod";

export type WritingMetadata = {
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  draft: boolean;
};

export type WritingRecord = WritingMetadata & {
  slug: string;
};

export type WritingDocument = WritingRecord & {
  Content: ComponentType;
};

const dateSchema = z.string().refine(isCalendarDate, {
  message: "Expected a valid YYYY-MM-DD date",
});

const writingMetadataSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  publishedAt: dateSchema,
  updatedAt: dateSchema.optional(),
  draft: z.boolean(),
});

type WritingModule = {
  default: ComponentType;
  article: unknown;
};

const writingsDirectory = path.join(process.cwd(), "src/content/writings");
let discoveredSlugsPromise: Promise<string[]> | undefined;
const documentPromises = new Map<string, Promise<WritingDocument | null>>();

function isCalendarDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

async function discoverWritingSlugs() {
  discoveredSlugsPromise ??= readdir(writingsDirectory, {
    withFileTypes: true,
  }).then((entries) =>
    entries
      .filter(
        (entry) =>
          entry.isFile() &&
          entry.name.endsWith(".mdx") &&
          !entry.name.startsWith("_"),
      )
      .map((entry) => entry.name.slice(0, -4))
      .sort(),
  );

  return discoveredSlugsPromise;
}

async function loadWriting(slug: string): Promise<WritingDocument | null> {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return null;
  }

  const slugs = await discoverWritingSlugs();
  if (!slugs.includes(slug)) {
    return null;
  }

  try {
    const writingModule = (await import(
      `../content/writings/${slug}.mdx`
    )) as WritingModule;
    const parsedMetadata = writingMetadataSchema.safeParse(writingModule.article);

    if (!parsedMetadata.success) {
      console.error(
        `Invalid writing metadata in ${slug}.mdx`,
        parsedMetadata.error.flatten().fieldErrors,
      );
      return null;
    }

    if (parsedMetadata.data.draft && process.env.NODE_ENV === "production") {
      return null;
    }

    return {
      slug,
      ...parsedMetadata.data,
      Content: writingModule.default,
    };
  } catch (error) {
    console.error(`Unable to load writing: ${slug}`, error);
    return null;
  }
}

export async function getWritingBySlug(slug: string) {
  if (!documentPromises.has(slug)) {
    documentPromises.set(slug, loadWriting(slug));
  }

  return documentPromises.get(slug)!;
}

export async function getWritingSlugs() {
  const slugs = await discoverWritingSlugs();
  const writings = await Promise.all(slugs.map(getWritingBySlug));

  return writings
    .filter((writing): writing is WritingDocument => writing !== null)
    .map((writing) => writing.slug);
}

export async function getAllWritings(): Promise<WritingRecord[]> {
  const slugs = await discoverWritingSlugs();
  const writings = await Promise.all(slugs.map(getWritingBySlug));

  return writings
    .filter((writing): writing is WritingDocument => writing !== null)
    .map(({ slug, title, description, publishedAt, updatedAt, draft }) => ({
      slug,
      title,
      description,
      publishedAt,
      updatedAt,
      draft,
    }))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function formatWritingDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}
