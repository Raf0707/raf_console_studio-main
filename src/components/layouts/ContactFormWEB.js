'use client';

import { useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const CONTACT_PATTERN = /^(\+?\d[\d\s\-()]{8,}|@[a-zA-Z0-9_]{3,}|https?:\/\/\S+)$/;

export default function ContactFormWEB() {
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        comment: '',
    });

    const [errors, setErrors] = useState({
        name: '',
        contact: '',
        comment: '',
    });

    const [personalDataConsent, setPersonalDataConsent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

    const commentRef = useRef(null);
    const { toast } = useToast();

    const SERVICE_WEB = process.env.NEXT_PUBLIC_SERVICE_WEB;

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors((current) => ({
                ...current,
                [name]: '',
            }));
        }
    };

    const handleCommentChange = (event) => {
        const value = event.target.value.slice(0, 500);

        setFormData((current) => ({
            ...current,
            comment: value,
        }));

        if (errors.comment) {
            setErrors((current) => ({
                ...current,
                comment: '',
            }));
        }

        const textarea = commentRef.current;

        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    const resetCommentHeight = () => {
        if (commentRef.current) {
            commentRef.current.style.height = 'auto';
        }
    };

    const validateForm = () => {
        let valid = true;

        const newErrors = {
            name: '',
            contact: '',
            comment: '',
        };

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
            valid = false;
        }

        if (!formData.contact.trim()) {
            newErrors.contact = 'Contact information is required';
            valid = false;
        } else if (!CONTACT_PATTERN.test(formData.contact.trim())) {
            newErrors.contact =
                'Enter a phone number, @username, or messenger profile link';
            valid = false;
        }

        if (!formData.comment.trim()) {
            newErrors.comment = 'Please briefly describe your website project';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!personalDataConsent) {
            toast({
                title: 'Consent required',
                description:
                    'Please consent to personal data processing before submitting the form.',
                variant: 'destructive',
            });
            return;
        }

        if (!validateForm()) {
            toast({
                title: 'Error',
                description: 'Please fill in all required fields',
                variant: 'destructive',
            });
            return;
        }

        if (!SERVICE_WEB) {
            toast({
                title: 'Configuration error',
                description: 'The form submission service is not configured.',
                variant: 'destructive',
            });
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(SERVICE_WEB, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    form: 'raf_console_web',
                    name: formData.name.trim(),
                    contact: formData.contact.trim(),
                    comment: formData.comment.trim(),
                }),
            });

            if (!response.ok) {
                throw new Error(`Server responded with status ${response.status}`);
            }

            toast({
                title: 'Success!',
                description: 'Your request has been sent',
            });

            setFormData({
                name: '',
                contact: '',
                comment: '',
            });
            setPersonalDataConsent(false);
            setErrors({
                name: '',
                contact: '',
                comment: '',
            });
            resetCommentHeight();
            setShowSuccessAlert(true);
        } catch (error) {
            console.error('Send error:', error);

            toast({
                title: 'Error',
                description: 'Could not send your request. Please try later.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <form
                id="contact-form"
                onSubmit={handleSubmit}
                className="raf-studio-order-form flex-1 space-y-4 p-8"
            >
                <div>
                    <label
                        htmlFor="web-name"
                        className="mb-1 block text-sm font-medium"
                    >
                        Your Name*
                    </label>

                    <Input
                        id="web-name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        autoComplete="name"
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={errors.name ? 'web-name-error' : undefined}
                        className={errors.name ? 'border-red-500' : ''}
                    />

                    {errors.name && (
                        <p
                            id="web-name-error"
                            className="mt-1 text-xs text-red-500"
                        >
                            {errors.name}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="web-contact"
                        className="mb-1 block text-sm font-medium"
                    >
                        Contact Info (WhatsApp | Telegram)*
                    </label>

                    <Input
                        id="web-contact"
                        name="contact"
                        value={formData.contact}
                        onChange={handleChange}
                        placeholder="@username, profile link, or phone number"
                        autoComplete="tel"
                        aria-invalid={Boolean(errors.contact)}
                        aria-describedby={
                            errors.contact ? 'web-contact-error' : undefined
                        }
                        className={errors.contact ? 'border-red-500' : ''}
                    />

                    {errors.contact && (
                        <p
                            id="web-contact-error"
                            className="mt-1 text-xs text-red-500"
                        >
                            {errors.contact}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between gap-4">
                        <label
                            htmlFor="web-comment"
                            className="text-sm font-medium text-black/70 dark:text-white/70"
                        >
                            Comment*
                        </label>

                        <span
                            className="text-xs tabular-nums text-black/40 dark:text-white/40"
                            aria-live="polite"
                        >
                            {formData.comment.length}/500
                        </span>
                    </div>

                    <textarea
                        ref={commentRef}
                        id="web-comment"
                        name="comment"
                        rows={3}
                        maxLength={300}
                        value={formData.comment}
                        onChange={handleCommentChange}
                        placeholder="Briefly describe your website, online store, landing page, or web application"
                        aria-invalid={Boolean(errors.comment)}
                        aria-describedby={
                            errors.comment ? 'web-comment-error' : undefined
                        }
                        className={`min-h-28 w-full resize-none overflow-hidden rounded-2xl border bg-white/55 px-4 py-3.5 text-black outline-none backdrop-blur-xl transition placeholder:text-black/35 focus:bg-white/75 dark:bg-white/[0.06] dark:text-white dark:placeholder:text-white/30 dark:focus:bg-white/[0.09] ${
                            errors.comment
                                ? 'border-red-500 focus:border-red-500 dark:border-red-500'
                                : 'border-black/10 focus:border-black/25 dark:border-white/10 dark:focus:border-white/25'
                        }`}
                    />

                    {errors.comment && (
                        <p
                            id="web-comment-error"
                            className="mt-1 text-xs text-red-500"
                        >
                            {errors.comment}
                        </p>
                    )}
                </div>

                <label className="raf-studio-consent-row flex cursor-pointer items-start gap-3 p-4">
                    <input
                        type="checkbox"
                        name="personalDataConsent"
                        required
                        checked={personalDataConsent}
                        onChange={(event) =>
                            setPersonalDataConsent(event.target.checked)
                        }
                        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-black dark:accent-white"
                    />

                    <span className="text-xs leading-5 text-black/55 dark:text-white/55">
                        I consent to the processing of my personal data exclusively
                        for reviewing my request, contacting me, preparing a proposal,
                        and providing the requested services in accordance with the{' '}
                        <a
                            href="/privacy_policy"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-black underline decoration-black/25 underline-offset-2 transition hover:decoration-black dark:text-white dark:decoration-white/30 dark:hover:decoration-white"
                            onClick={(event) => event.stopPropagation()}
                        >
                            Personal Data Processing Policy
                        </a>

                    </span>
                </label>

                <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading || !personalDataConsent}
                >
                    {isLoading ? 'Sending...' : 'Submit'}
                </Button>
            </form>

            {showSuccessAlert && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="web-success-title"
                >
                    <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-800">
                        <h3
                            id="web-success-title"
                            className="mb-2 text-lg font-bold"
                        >
                            Success!
                        </h3>

                        <p className="mb-4">
                            Your request has been sent. We will contact you shortly.
                        </p>

                        <Button
                            type="button"
                            className="w-full"
                            onClick={() => setShowSuccessAlert(false)}
                        >
                            OK
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
}
