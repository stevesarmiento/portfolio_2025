import { HomeClient } from "@/components/home-client";
import { getAllWritings } from "@/lib/writings";

export default async function Home() {
  const writings = (await getAllWritings()).map(
    ({ slug, title, publishedAt }) => ({ slug, title, publishedAt }),
  );

  return <HomeClient writings={writings} />;
}
