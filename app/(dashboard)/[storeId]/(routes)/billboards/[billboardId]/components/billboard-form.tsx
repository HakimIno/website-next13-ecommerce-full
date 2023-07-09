"use client";

import { useState } from "react";
import axios from "axios";
import * as z from "zod";
import { Billboard } from "@prisma/client"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";

import { useOrigin } from "@/hooks/use-origin";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { AlertModal } from "@/components/modals/alert-modal";

import { Trash2 } from "lucide-react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import ImageUpload from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";




const formSchema = z.object({
    label: z.string().min(1),
    imageUrl: z.string().min(1)
})

type BillboardsFormValue = z.infer<typeof formSchema>;

interface BillboardFormProps {
    initialData: Billboard | null
}


export const BillboardForm: React.FC<BillboardFormProps> = ({
    initialData
}) => {

    const params = useParams();
    const router = useRouter();
    const origin = useOrigin();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? "แก้ไขป้ายโฆษณา" : "สร้างป้ายโฆษณา";
    const description = initialData ? "แก้ไขป้ายโฆษณา" : "เพิ่มป้ายโฆษณาใหม่";
    const toastMessage = initialData ? "อัปเดตป้ายโฆษณา" : "สร้างป้ายโฆษณาแล้ว"
    const action = initialData ? "บันทึก" : "สร้าง"

    const form = useForm<BillboardsFormValue>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            label: '',
            imageUrl: ''
        }
    });

    const onSubmit = async (data: BillboardsFormValue) => {
        try {
            setLoading(true);

            if (initialData) {
                await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, data);
            } else {
                await axios.post(`/api/${params.storeId}/billboards`, data);
            }

            router.refresh();
            router.push(`/${params.storeId}/billboards`);

            toast.success(toastMessage)

        } catch (error) {
            toast.error("เอ๊ะ! มีบางอย่างผิดพลาด")
        } finally {
            setLoading(false);
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true);

            await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`);

            router.refresh();

            router.push(`/${params.storeId}/billboards`);

            toast.success('ลบสำเร็จ.');

        } catch (error: any) {
            toast.error('ตรวจสอบให้แน่ใจว่าคุณได้นําโฆษณาออก');
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            <div className="flex justify-center ">
                <div className="w-[1200px] space-y-8 ">
                    <div className="flex items-center justify-between">
                        <Heading
                            title={title}
                            description={description}
                        />
                        {initialData && (
                            <Button
                                disabled={loading}
                                variant="ghost"
                                size="icon"
                                onClick={() => setOpen(true)}
                            >
                                <Trash2 className="h-5 w-5 text-red-600" />
                            </Button>
                        )}


                    </div>
                    <Separator />

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8 w-full"
                        >

                            <FormField
                                control={form.control}
                                name="imageUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Background image</FormLabel>
                                        <FormControl>
                                            <ImageUpload
                                                value={field.value ? [field.value] : []}
                                                disabled={loading}
                                                onChange={(url) => field.onChange(url)}
                                                onRemove={() => field.onChange('')}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="md:grid md:grid-cols-3 gap-8">
                                <FormField
                                    control={form.control}
                                    name="label"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Label</FormLabel>
                                            <FormControl>
                                                <Input disabled={loading} placeholder="Billboard label" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Button disabled={loading} className="ml-auto" type="submit" >
                                {action}
                            </Button>
                        </form>
                    </Form>
                    <Separator />
                </div>
            </div>
        </>
    )
}