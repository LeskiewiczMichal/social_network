import { useParams } from 'react-router-dom';

export default function Profile() {
  const { userId } = useParams();
  console.log(userId);

  return (
    <main className="padding-top-header">
      <h1>ok</h1>
    </main>
  );
}
