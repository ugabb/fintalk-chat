"use client"

import useConversation from '@/app/hooks/useConversation'
import axios from 'axios'
import React from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { PiImage, PiPaperPlaneTilt } from 'react-icons/pi'
import MessageInput from './MessageInput'
import { Button } from '@/components/ui/button'

import { CldUploadButton } from 'next-cloudinary'

const Form = () => {
    const { conversationId } = useConversation()

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<FieldValues>({
        defaultValues: {
            message: ''
        }
    })

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        // clear the message form
        console.log(data)
        setValue("message", "", { shouldValidate: true })

        axios.post('/api/messages', { ...data, conversationId })
    }

    const handleUpload = (result: any) => {
        axios.post("/api/messages", {
            image: result?.info?.secure_url,
            conversationId
        })
    }

    return (
        <div
            className="
          py-4 
          px-4 
          bg-white 
          border-t 
          flex 
          items-center 
          gap-2 
          lg:gap-4 
          w-full
          fixed
          bottom-0
        "
        >
            <CldUploadButton
                options={{ maxFiles: 1 }}
                onUpload={handleUpload}
                uploadPreset='fintalk-chat'
            >
                <PiImage size={30} className="text-main" />
            </CldUploadButton>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex items-center gap-2 lg:gap-4 w-full"
            >
                <MessageInput
                    id="message"
                    register={register}
                    errors={errors}
                    required
                    placeholder="Escreva uma mensagem"
                />

                <Button type='submit' className='rounded-full p-2 bg-main hover:bg-main/50' >
                    <PiPaperPlaneTilt size={20} />
                </Button>
            </form>
        </div>
    )
}

export default Form