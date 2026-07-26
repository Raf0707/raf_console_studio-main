'use client';

import ContactFormRu from '@/components/layouts_ru/ContactFormRu';
import ContactFormWEBRu from '@/components/layouts_ru/ContactFormWEB_ru';
import {
  AppStudioGlass,
  appStudioContentRu,
} from '@/components/appstudio';

export default function StudioPage() {
  return (
    <AppStudioGlass
      content={appStudioContentRu}
      forms={{
        mobile: <ContactFormRu />,
        web: <ContactFormWEBRu />,
      }}
    />
  );
}
