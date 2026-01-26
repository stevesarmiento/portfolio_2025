import { GithubContributions } from "./github-contributions";

export default function GithubSection() {
  return (
    <div className="flex flex-col items-left">
      <GithubContributions username="stevesarmiento" showFullYear={false} />
    </div>
  );
}