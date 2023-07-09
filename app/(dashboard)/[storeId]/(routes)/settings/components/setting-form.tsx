"use client";

import { useState } from "react";
import axios from "axios";
import * as z from "zod";
import { Store } from "@prisma/client"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { Trash2 } from "lucide-react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";
import { ApiAlert } from "@/components/ui/api-alert";
import { useOrigin } from "@/hooks/use-origin";



interface SettingFormProps {
    initialData: Store
}

const formSchema = z.object({
    name: z.string().min(1),
})

type SettingsFormValue = z.infer<typeof formSchema>;

export const SettingForm: React.FC<SettingFormProps> = ({
    initialData
}) => {

    const params = useParams();
    const router = useRouter();
    const origin = useOrigin();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm<SettingsFormValue>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
    });

    const onSubmit = async (data: SettingsFormValue) => {
        try {
            setLoading(true);

            await axios.patch(`/api/stores/${params.storeId}`, data);

            router.refresh();

            toast.success("อัปเดตสำเร็จ.")

        } catch (error) {
            toast.error("เอ๊ะ! มีบางอย่างผิดพลาด")
        } finally {
            setLoading(false);
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true);

            await axios.delete(`/api/stores/${params.storeId}`);

            router.refresh();

            router.push('/');

            toast.success('ลบสำเร็จ.');

        } catch (error: any) {
            toast.error('ตรวจสอบให้แน่ใจว่าคุณได้นําผลิตภัณฑ์และหมวดหมู่ทั้งหมดออกก่อน');
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
                            title="การตั้งค่า"
                            description="ตั้งค่าร้านของคุณ"
                        />

                        <Button
                            disabled={loading}
                            variant="ghost"
                            size="icon"
                            onClick={() => setOpen(true)}
                        >
                            <Trash2 className="h-5 w-5 text-red-600" />
                        </Button>
                    </div>
                    <Separator />

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8 w-full"
                        >
                            <div
                                className="grid grid-cols-3 gap-8"
                            >
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input disabled={loading} placeholder="ชื่อร้านของคุณ" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button disabled={loading} className="ml-auto" type="submit" >
                                บันทึก
                            </Button>
                        </form>
                    </Form>
                    <Separator />
 
                    <ApiAlert
                        title="NEXT_PUBLIC_API_URL"
                        description={`${origin}/api/${params.storeId}`}
                        variant="public"
                    />
                </div>
            </div>


        </>
    )
}