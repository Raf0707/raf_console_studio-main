'use client';

import { useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const CONTACT_PATTERN = /^(\+?\d[\d\s\-()]{8,}|@[a-zA-Z0-9_]{3,}|https?:\/\/\S+)$/;

export default function ContactFormWEBRu() {
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
            newErrors.name = 'Заполните обязательное поле';
            valid = false;
        }

        if (!formData.contact.trim()) {
            newErrors.contact = 'Заполните обязательное поле';
            valid = false;
        } else if (!CONTACT_PATTERN.test(formData.contact.trim())) {
            newErrors.contact =
                'Введите номер телефона, @username или ссылку на профиль в мессенджере';
            valid = false;
        }

        if (!formData.comment.trim()) {
            newErrors.comment = 'Кратко опишите задачу по разработке сайта';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!personalDataConsent) {
            toast({
                title: 'Необходимо согласие',
                description:
                    'Подтвердите согласие на обработку персональных данных.',
                variant: 'destructive',
            });
            return;
        }

        if (!validateForm()) {
            toast({
                title: 'Ошибка',
                description: 'Пожалуйста, заполните все обязательные поля',
                variant: 'destructive',
            });
            return;
        }

        if (!SERVICE_WEB) {
            toast({
                title: 'Ошибка конфигурации',
                description: 'Сервис отправки формы не настроен.',
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
                title: 'Успешно!',
                description: 'Ваша заявка отправлена',
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
                title: 'Ошибка',
                description: 'Не удалось отправить заявку. Попробуйте позже.',
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
                className="flex-1 space-y-4 rounded-2xl bg-white/70 p-8 shadow-lg dark:bg-white/5"
            >
                <div>
                    <label
                        htmlFor="web-name-ru"
                        className="mb-1 block text-sm font-medium"
                    >
                        Ваше имя*
                    </label>

                    <Input
                        id="web-name-ru"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Введите ваше имя"
                        autoComplete="name"
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={
                            errors.name ? 'web-name-ru-error' : undefined
                        }
                        className={errors.name ? 'border-red-500' : ''}
                    />

                    {errors.name && (
                        <p
                            id="web-name-ru-error"
                            className="mt-1 text-xs text-red-500"
                        >
                            {errors.name}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="web-contact-ru"
                        className="mb-1 block text-sm font-medium"
                    >
                        Контактные данные (WhatsApp / Telegram / MAX)*
                    </label>

                    <Input
                        id="web-contact-ru"
                        name="contact"
                        value={formData.contact}
                        onChange={handleChange}
                        placeholder="@username, ссылка на профиль или номер телефона"
                        autoComplete="tel"
                        aria-invalid={Boolean(errors.contact)}
                        aria-describedby={
                            errors.contact ? 'web-contact-ru-error' : undefined
                        }
                        className={errors.contact ? 'border-red-500' : ''}
                    />

                    {errors.contact && (
                        <p
                            id="web-contact-ru-error"
                            className="mt-1 text-xs text-red-500"
                        >
                            {errors.contact}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between gap-4">
                        <label
                            htmlFor="web-comment-ru"
                            className="text-sm font-medium text-black/70 dark:text-white/70"
                        >
                            Комментарий*
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
                        id="web-comment-ru"
                        name="comment"
                        rows={3}
                        maxLength={500}
                        value={formData.comment}
                        onChange={handleCommentChange}
                        placeholder="Кратко расскажите о сайте, интернет-магазине, лендинге или веб-приложении"
                        aria-invalid={Boolean(errors.comment)}
                        aria-describedby={
                            errors.comment ? 'web-comment-ru-error' : undefined
                        }
                        className={`min-h-28 w-full resize-none overflow-hidden rounded-2xl border bg-white/55 px-4 py-3.5 text-black outline-none backdrop-blur-xl transition placeholder:text-black/35 focus:bg-white/75 dark:bg-white/[0.06] dark:text-white dark:placeholder:text-white/30 dark:focus:bg-white/[0.09] ${
                            errors.comment
                                ? 'border-red-500 focus:border-red-500 dark:border-red-500'
                                : 'border-black/10 focus:border-black/25 dark:border-white/10 dark:focus:border-white/25'
                        }`}
                    />

                    {errors.comment && (
                        <p
                            id="web-comment-ru-error"
                            className="mt-1 text-xs text-red-500"
                        >
                            {errors.comment}
                        </p>
                    )}
                </div>

                <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-black/[0.08] bg-white/35 p-4 backdrop-blur-xl transition hover:bg-white/55 dark:border-white/[0.09] dark:bg-white/[0.035] dark:hover:bg-white/[0.06]">
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
                        Я даю согласие на обработку моих персональных данных
                        исключительно в целях рассмотрения заявки, обратной связи,
                        подготовки предложения и оказания запрошенных услуг в
                        соответствии с{' '}
                        <a
                            href="/privacy_policy_ru"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-black underline decoration-black/25 underline-offset-2 transition hover:decoration-black dark:text-white dark:decoration-white/30 dark:hover:decoration-white"
                            onClick={(event) => event.stopPropagation()}
                        >
                            политикой обработки персональных данных
                        </a>
                        .
                    </span>
                </label>

                <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading || !personalDataConsent}
                >
                    {isLoading ? 'Отправка...' : 'Отправить заявку'}
                </Button>
            </form>

            {showSuccessAlert && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="web-success-title-ru"
                >
                    <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-800">
                        <h3
                            id="web-success-title-ru"
                            className="mb-2 text-lg font-bold"
                        >
                            Успешно!
                        </h3>

                        <p className="mb-4">
                            Ваша заявка отправлена. Мы свяжемся с вами в ближайшее
                            время.
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
