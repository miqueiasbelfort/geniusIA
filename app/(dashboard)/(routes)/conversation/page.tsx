"use client";
import React, { useState } from 'react';

import * as z from 'zod';
import Heading from '@/components/heading';
import axios from 'axios';
import Loader from '@/components/loader';

import { MessageSquare } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { formSchema } from './constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {useRouter} from 'next/navigation';
import { Empty } from '@/components/empty';
// import UserAvatar from '@/components/user-avatar';
// import BotAvatar from '@/components/bot-avatar';

function ConversationPage() {

    const router = useRouter();
    const [message, setMessage] = useState('');

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: ""
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values : z.infer<typeof formSchema>) => {
        try {
            
            const response = await axios.post('/api/conversation', {
                message: values.prompt
            });

            setMessage(response.data);

            form.reset();

        } catch (error) {
            console.log(error);
        } finally {
            router.refresh();
        }
    };

  return (
    <div>
        <Heading 
            title='Conversation'
            description='Our most advancent conversation model.'
            icon={MessageSquare}
            iconColor='text-violet-500'
            bgColor='bg-violet-500/10'
        />
        <div className='px-4 lg:px-8'>
            <div>
                <Form {...form}>
                    <form 
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2'
                    >
                        <FormField name='prompt' render={({field}) => (
                            <FormItem className='col-span-12 lg:col-span-10'>
                                <FormControl className='m-0 p-0'>
                                    <Input 
                                        className='border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent'
                                        disabled={isLoading}
                                        placeholder='How do I calculate the radius of circle'
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}/>
                        <Button className='col-span-12 lg:col-span-2 w-full' disabled={isLoading}>Generate</Button>
                    </form>
                </Form>
            </div>
            <div className='space-y-4 mt-4'>
                {isLoading && (
                    <div className='p-8 rounded-lg w-full flex items-center justify-center bg-muted'>
                        <Loader/>
                    </div>
                )}
                <div>
                    <Empty label='No conversation stared.'/>
                </div>
                <div className='flex flex-col-reverse gap-y-4'>
                    {message}
                </div>
            </div>
        </div>
    </div>
  )
}

export default ConversationPage;