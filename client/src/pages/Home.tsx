import { PostsSection, PostForm } from '../features/posts';

export default function Home() {
  return (
    <div className="padding-top-header min-h-screen flex flex-col items-center">
      <PostForm />
      <PostsSection />
    </div>
  );
}
