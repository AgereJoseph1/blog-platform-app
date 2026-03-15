import PostDetail from '../../../components/PostDetail';
import { notFound } from 'next/navigation';

interface Props {
  params: { id: string };
}

export default function PostDetailPage({ params }: Props) {
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    notFound();
  }
  return <PostDetail id={id} />;
}
