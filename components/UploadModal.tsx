"use client"; 

import uniqid from "uniqid";
import React, { useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react'; // Importação de um hook relacionado ao Supabase.
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'; // Importações relacionadas ao gerenciamento de formulários.
import { toast } from "react-hot-toast"; // Importação de uma biblioteca para exibição de notificações.
import { useRouter } from "next/navigation"; // Importação do roteador Next.js.

import useUploadModal from '@/hooks/useUploadModal'; // Importação de um hook personalizado.
import { useUser } from "@/hooks/useUser"; // Importação de outro hook personalizado.

import Modal from './Modal'; // Importação de um componente de modal personalizado.
import Input from './Input'; // Importação de um componente de entrada personalizado.
import Button from './Button'; // Importação de um componente de botão personalizado.

const UploadModal = () => {
    const [isLoading, setIsLoading] = useState(false); // Estado local para controlar o estado de carregamento.

    const uploadModal = useUploadModal(); // Hook personalizado para gerenciar um modal de upload.
    const supabaseClient = useSupabaseClient(); // Hook personalizado relacionado ao Supabase.
    const { user } = useUser(); // Hook personalizado para obter informações do usuário.
    const router = useRouter(); // Hook do roteador Next.js.

    const {
        register,
        handleSubmit,
        reset,
    } = useForm<FieldValues>({
        defaultValues: {
            author: '',
            title: '',
            song: null,
            image: null,
        }
    }); // Configuração do formulário usando React Hook Form.

    // Função para lidar com as mudanças no estado do modal.
    const onChange = (open: boolean) => {
        if (!open) {
            reset(); // Redefinir o formulário.
            uploadModal.onClose(); // Fechar o modal.
        }
    }

    // Função para lidar com o envio do formulário.
    const onSubmit: SubmitHandler<FieldValues> = async (values) => {
        try {
            setIsLoading(true); // Ativar o estado de carregamento.

            const imageFile = values.image?.[0];
            const songFile = values.song?.[0];

            if (!imageFile || !songFile || !user) {
                toast.error('Missing fields'); // Exibir uma notificação de erro se campos obrigatórios estiverem em falta.
                return;
            }

            const uniqueID = uniqid(); // Gerar um ID único.

            // Upload da música para o armazenamento.
            const {
                data: songData,
                error: songError
            } = await supabaseClient
                .storage
                .from('songs')
                .upload(`song-${values.title}-${uniqueID}`, songFile, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (songError) {
                setIsLoading(false); // Desativar o estado de carregamento em caso de erro.
                return toast.error('Failed song upload'); // Exibir uma notificação de erro.
            }

            // Upload da imagem para o armazenamento.
            const {
                data: imageData,
                error: imageError
            } = await supabaseClient
                .storage
                .from('images')
                .upload(`image-${values.title}-${uniqueID}`, imageFile, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (imageError) {
                setIsLoading(false); // Desativar o estado de carregamento em caso de erro.
                return toast.error('Failed image upload'); // Exibir uma notificação de erro.
            }

            // Criação de um registro no banco de dados.
            const { error: supabaseError } = await supabaseClient
                .from('songs')
                .insert({
                    user_id: user.id,
                    title: values.title,
                    author: values.author,
                    image_path: imageData.path,
                    song_path: songData.path
                });

            if (supabaseError) {
                return toast.error(supabaseError.message); // Exibir uma notificação de erro.
            }

            router.refresh(); // Atualizar a rota.
            setIsLoading(false); // Desativar o estado de carregamento.
            toast.success('Song created!'); // Exibir uma notificação de sucesso.
            reset(); // Redefinir o formulário.
            uploadModal.onClose(); // Fechar o modal.
        } catch (error) {
            toast.error('Something went wrong'); // Exibir uma notificação de erro genérica em caso de falha.
        } finally {
            setIsLoading(false); // Garantir que o estado de carregamento seja desativado mesmo em caso de erro.
        }
    }

    return (
        <Modal
            title="Add a song"
            description="Upload an mp3 file"
            isOpen={uploadModal.isOpen}
            onChange={onChange}
        >
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-y-4"
            >
                <Input
                    id="title"
                    disabled={isLoading}
                    {...register('title', { required: true })}
                    placeholder="Song title"
                />
                <Input
                    id="author"
                    disabled={isLoading}
                    {...register('author', { required: true })}
                    placeholder="Song author"
                />
                <div>
                    <div className="pb-1">
                        Select a song file
                    </div>
                    <Input
                        placeholder="test"
                        disabled={isLoading}
                        type="file"
                        accept=".mp3"
                        id="song"
                        {...register('song', { required: true })}
                    />
                </div>
                <div>
                    <div className="pb-1">
                        Select an image
                    </div>
                    <Input
                        placeholder="test"
                        disabled={isLoading}
                        type="file"
                        accept="image/*"
                        id="image"
                        {...register('image', { required: true })}
                    />
                </div>
                <Button disabled={isLoading} type="submit">
                    Create
                </Button>
            </form>
        </Modal>
    );
}

export default UploadModal;