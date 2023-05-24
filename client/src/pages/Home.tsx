import { PostsSection } from '../features/posts';

export default function Home() {
  return (
    <div className="bg-background-white min-h-screen flex flex-col items-center">
      <PostsSection />
    </div>
  );
}
