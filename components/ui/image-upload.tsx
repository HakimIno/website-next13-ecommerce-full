"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { CldUploadWidget } from "next-cloudinary";

import { Button } from "@/components/ui/button";
import { ImagePlus, Trash2, X } from "lucide-react";



interface ImageUploadProps {
    disabled?: boolean;
    onChange: (value: string) => void;
    onRemove: (value: string) => void;
    value: string[]
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    disabled,
    onChange,
    onRemove,
    value
}) => {

    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true);
    }, []);



    const onUpload = (result: any) => {
        onChange(result.info.secure_url);
    }

    if (!isMounted) {
        return null;
    }

    return (
        <div className="">
            <div className="mb-4 flex items-center gap-4">
                {value.map((url) => (
                    <div key={url} className=" relative w-[200px] h-[200px] rounded-md overflow-hidden">
                        <div className="z-10 absolute top-1 right-1">
                            <Button type="button" onClick={() => onRemove(url)}  size="icon" className="w-8 h-8 rounded-2xl bg-blue-950/50 hover:bg-blue-950/50">
                            <Trash2 className="h-5 w-5 " />
                            </Button>
                        </div>
                        <Image
                            fill
                            className="object-cover"
                            alt="Image"
                            src={url}
                        />
                    </div>
                ))}
            </div>
            <CldUploadWidget onUpload={onUpload} uploadPreset="yecelmzf">
                {({ open }) => {
                    const onClick = () => {
                        open();
                    }

                    return (
                        <Button
                            type="button"
                            disabled={disabled}
                            variant="secondary"
                            onClick={onClick}
                        >
                            <ImagePlus className="h-4 w-4 mr-2" />
                            อัพโหลดรูป
                        </Button>
                    )
                }}
            </CldUploadWidget>
        </div>
    )
}

export default ImageUpload;