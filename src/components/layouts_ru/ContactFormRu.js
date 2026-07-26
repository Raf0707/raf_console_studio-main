'use client';

import { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function ContactFormAppRu() {
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        comment: ''
    });
    const [errors, setErrors] = useState({
        name: '',
        contact: '',
        comment: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const { toast } = useToast();

    const [comment, setComment] = useState('');
    const [personalDataConsent, setPersonalDataConsent] = useState(false);
    const commentRef = useRef(null);

    const handleCommentChange = (event) => {
        const value = event.target.value.slice(0, 500);

        setComment(value);

        const textarea = commentRef.current;

        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    const SERVICE_APP = process.env.NEXT_PUBLIC_SERVICE_APP;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        let valid = true;
        const newErrors = { name: '', contact: '', comment: '' };

        if (!formData.name.trim()) {
            newErrors.name = 'Заполните обязательное поле';
            valid = false;
        }
        if (!formData.contact.trim()) {
            newErrors.contact = 'Заполните обязательное поле';
            valid = false;
        } else if (!/^(\+?\d{10,}|@\w+)$/.test(formData.contact)) {
            newErrors.contact = 'Введите номер телефона (+...) или юзернейм Telegram (@...)';
            valid = false;
        }
        if (!formData.comment.trim()) {
            newErrors.comment = 'Оставьте комментарий по теме вашего обращения';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (e) => {
        if (!personalDataConsent) {
            return;
        }

        e.preventDefault();

        if (!validateForm()) {
            toast({
                title: "Ошибка",
                description: "Пожалуйста, заполните все обязательные поля",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(SERVICE_APP, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    form: "raf_console_app",
                    name: formData.name,
                    contact: formData.contact,
                    comment: formData.comment,
                }),
            });

            if (response.ok) {
                toast({ title: "Успешно!", description: "Ваша заявка отправлена" });
                setFormData({ name: "", contact: "", comment: "" });
                setShowSuccessAlert(true);
            } else {
                throw new Error("Ошибка сервера");
            }
        } catch (err) {
            console.error("Send error:", err);
            toast({
                title: "Ошибка",
                description: "Не удалось отправить заявку. Попробуйте позже.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <form
                onSubmit={handleSubmit}
                className="bg-white/70 dark:bg-white/5 rounded-2xl shadow-lg p-8 flex-1 space-y-4"
            >
                <div>
                    <label className="block text-sm font-medium mb-1">Ваше имя*</label>
                    <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Введите ваше имя"
                        className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Контактные данные (WhatsApp / Telegram / MAX)*</label>
                    <Input
                        name="contact"
                        value={formData.contact}
                        onChange={handleChange}
                        placeholder="@username или номер телефона"
                        className={errors.contact ? 'border-red-500' : ''}
                    />
                    {errors.contact && <p className="text-red-500 text-xs mt-1">{errors.contact}</p>}
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between gap-4">
                        <label
                            htmlFor="comment"
                            className="text-sm font-medium text-black/70 dark:text-white/70"
                        >
                            Комментарий
                        </label>

                        <span
                            className="text-xs tabular-nums text-black/40 dark:text-white/40"
                            aria-live="polite"
                        >
      {comment.length}/500
    </span>
                    </div>

                    <textarea
                        ref={commentRef}
                        id="comment"
                        name="comment"
                        rows={3}
                        maxLength={300}
                        value={comment}
                        onChange={handleCommentChange}
                        placeholder="Расскажите кратко о задаче, приложении или вашей идее"
                        className="min-h-28 w-full resize-none overflow-hidden rounded-2xl border border-black/10 bg-white/55 px-4 py-3.5 text-black outline-none backdrop-blur-xl transition placeholder:text-black/35 focus:border-black/25 focus:bg-white/75 dark:border-white/10 dark:bg-white/[0.06] dark:text-white dark:placeholder:text-white/30 dark:focus:border-white/25 dark:focus:bg-white/[0.09]"
                    />
                </div>

                <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-black/[0.08] bg-white/35 p-4 backdrop-blur-xl transition hover:bg-white/55 dark:border-white/[0.09] dark:bg-white/[0.035] dark:hover:bg-white/[0.06]">
                    <input
                        type="checkbox"
                        name="personalDataConsent"
                        required
                        checked={personalDataConsent}
                        onChange={(event) => setPersonalDataConsent(event.target.checked)}
                        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-black dark:accent-white"
                    />

                    <span className="text-xs leading-5 text-black/55 dark:text-white/55">
    Я даю согласие на обработку моих персональных данных исключительно
    в целях рассмотрения заявки, обратной связи, подготовки предложения
    и оказания запрошенных услуг в соответствии с{' '}
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

                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Отправка...' : 'Отправить заявку'}
                </Button>
            </form>

            {showSuccessAlert && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
                        <h3 className="text-lg font-bold mb-2">Успешно!</h3>
                        <p className="mb-4">Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.</p>
                        <Button className="w-full" onClick={() => setShowSuccessAlert(false)}>
                            OK
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
}
