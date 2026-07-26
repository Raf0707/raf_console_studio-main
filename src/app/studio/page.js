'use client';

import ContactForm from '@/components/layouts/ContactForm';
import ContactFormWEB from '@/components/layouts/ContactFormWEB';
import {
  AppStudioGlass,
  appStudioContentEn,
} from '@/components/appstudio';

export default function StudioPage() {
  return (
    <AppStudioGlass
      content={appStudioContentEn}
      forms={{
        mobile: <ContactForm />,
        web: <ContactFormWEB />,
      }}
    />
  );
}
