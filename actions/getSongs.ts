import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { Song } from "@/types";

// Função assíncrona para obter músicas
const getSongs = async (): Promise<Song[]> => {
    // Cria um cliente Supabase para autenticação do servidor
    const supabase = createServerComponentClient({
        cookies: cookies, // Usa os cookies do Next.js para autenticação
    });

    // Realiza uma consulta para obter todas as músicas ordenadas por data de criação decrescente
    const { data, error } = await supabase
        .from('songs') // Nome da tabela no Supabase
        .select('*') // Seleciona todos os campos da tabela
        .order('created_at', { ascending: false }); // Ordena os resultados pela data de criação em ordem decrescente

    // Verifica se houve algum erro na consulta
    if (error) {
        console.log(error.message); // Registra o erro no console
    }

    // Retorna os dados (ou um array vazio, caso não haja dados)
    return (data as any) || [];
};

export default getSongs;