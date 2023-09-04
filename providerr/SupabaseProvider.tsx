"use client"; 

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";

import { Database } from "@/types_db"; // Importação do tipo de dados, talvez isso possa ser melhor organizado

// Interface para as props do componente SupabaseProvider
interface SupabaseProviderProps {
    children: React.ReactNode;
};

// O componente SupabaseProvider
const SupabaseProvider: React.FC<SupabaseProviderProps> = ({
    children
}) => {
    // Use o hook useState para criar um estado supabaseClient
    const [supabaseClient] = useState(() =>
        createClientComponentClient<Database>()
    );

    return (
        // Fornece o supabaseClient para a SessionContextProvider
        <SessionContextProvider supabaseClient={supabaseClient}>
            {children}
        </SessionContextProvider>
    );
}

export default SupabaseProvider; // Exporta o componente SupabaseProvider como padrão