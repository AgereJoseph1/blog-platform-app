import PostEdit from '../../../../components/PostEdit';
import { notFound } from 'next/navigation';

interface Props {
  params: { id: string };
}

export default function EditPostPage({ params }: Props) {
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    notFound();
  }
  return <PostEdit id={id} />;
}
