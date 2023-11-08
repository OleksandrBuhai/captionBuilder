'use client'
import { useState } from "react";
import UploadIcon from "./UploadIcon"
import axios from 'axios'
import { useRouter } from "next/navigation";

export default function UploadForm() {

    const [isUploading, setIsUploading] = useState(false)
    const router = useRouter()

    async function upload(e) {
        e.preventDefault();
        console.log(e)
        const files = e.target.files;

        if (files.length > 0) {
            const file = files[0];

            try {
                setIsUploading(true)
                const res = await axios.postForm('/api/upload', { file, });
                console.log(res.data);
                setIsUploading(false)
                const newName = res.data.newName
                router.push('/' + newName)
            } catch (error) {
                console.error('Error during file upload:', error);
            }
      
        }
      
    }

    return (
        <>
            {isUploading && (
                <div className="bg-black/90 text-white fixed inset-0 flex items-center">
                    <div className="w-full text-center">
                        <h2 className="text-4xl mb-4">Uploading</h2>
                        <h3 className="text-xl">Please wait...</h3>
                    </div>
                </div>
            )}
            <label className='mt-10'>
                <span className='bg-[#f64c72]  rounded-xl  text-white s flex flex-row gap-2  max-w-xs mx-auto p-4 cursor-pointer '>
                    <UploadIcon />
                    Chose file</span>
                <input onChange={upload} type="file" className="hidden" />
            </label>
        </>
    )
}

