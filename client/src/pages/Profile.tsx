import { useParams } from 'react-router-dom';

export default function Profile() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { userId } = useParams();

  return (
    <main className="padding-top-header">
      <h1>ok</h1>
    </main>
  );
}
