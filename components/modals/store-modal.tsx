"use client";

import { useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios";
import { toast } from "react-hot-toast";

import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "@/components/ui/modal";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";




const fromSchema = z.object({
    name: z.string().min(1),
})

export const StoreModal = () => {
    const storeModal = useStoreModal();

    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof fromSchema>>({
        resolver: zodResolver(fromSchema),
        defaultValues: {
            name: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof fromSchema>) => {
        try {
            setIsLoading(true)

            const response = await axios.post('/api/stores', values)

            window.location.assign(`/${response.data.id}`);
            
        } catch (error) {
            toast.error("เอ๊ะ! มีบางอย่างผิดพลาด")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Modal
            title="สร้างร้านค้า"
            description="เพิ่มร้านค้าใหม่เพื่อจัดการสินค้าและหมวดหมู่"
            isOpen={storeModal.isOpen}
            onClose={storeModal.onClose}
        >
            <div>
                <div className="space-y-4 py-2 pb-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>ชื่อร้าน</FormLabel>
                                        <FormControl>
                                            <Input disabled={isLoading} placeholder="ชื่อร้านของคุณ" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="pt-6 space-x-2 flex items-center justify-end">
                                <Button
                                    disabled={isLoading}
                                    variant="outline"
                                    onClick={storeModal.onClose}
                                >ยกเลิก</Button>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                >ยืนยัน</Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </Modal>
    );
};