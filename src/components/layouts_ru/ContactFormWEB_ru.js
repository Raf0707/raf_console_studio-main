'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function ContactFormWEBRu() {
    const [formData, setFormData] = useState({ name: '', contact: '', comment: '' });
    const [errors, setErrors] = useState({ name: '', contact: '', comment: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const { toast } = useToast();
    const SERVICE_WEB = process.env.NEXT_PUBLIC_SERVICE_WEB;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
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
            const response = await fetch(SERVICE_WEB, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    form: "raf_console_web",
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
                    <label className="block text-sm font-medium mb-1">Контактные данные (WhatsApp/Telegram)*</label>
                    <Input
                        name="contact"
                        value={formData.contact}
                        onChange={handleChange}
                        placeholder="@username или номер телефона"
                        className={errors.contact ? 'border-red-500' : ''}
                    />
                    {errors.contact && <p className="text-red-500 text-xs mt-1">{errors.contact}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Комментарий*</label>
                    <Textarea
                        name="comment"
                        value={formData.comment}
                        onChange={handleChange}
                        placeholder="Введите ваш комментарий"
                        rows={5}
                        className={errors.comment ? 'border-red-500' : ''}
                    />
                    {errors.comment && <p className="text-red-500 text-xs mt-1">{errors.comment}</p>}
                </div>

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
