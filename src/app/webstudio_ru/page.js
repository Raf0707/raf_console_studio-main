import { redirect } from 'next/navigation';

;

export default function WebStudioRedirectPage() {
  redirect('/studio_ru?service=web');
}
