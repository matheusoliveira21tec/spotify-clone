import { useEffect, useState, createContext, useContext } from 'react';
import {
    useUser as useSupaUser,
    useSessionContext,
    User
} from '@supabase/auth-helpers-react';

import { UserDetails, Subscription } from '@/types';

// Define o tipo para o contexto de usuário
type UserContextType = {
    accessToken: string | null;
    user: User | null;
    userDetails: UserDetails | null;
    isLoading: boolean;
    subscription: Subscription | null;
};

// Cria o contexto de usuário
export const UserContext = createContext<UserContextType | undefined>(
    undefined
);

export interface Props {
    [propName: string]: any;
}

// Componente que fornece o contexto de usuário
export const MyUserContextProvider = (props: Props) => {
    // Obtém informações da sessão e cliente Supabase
    const {
        session,
        isLoading: isLoadingUser,
        supabaseClient: supabase
    } = useSessionContext();
    // Obtém o usuário autenticado
    const user = useSupaUser();
    // Obtém o token de acesso da sessão
    const accessToken = session?.access_token ?? null;
    // Estado para controlar o carregamento de dados
    const [isLoadingData, setIsloadingData] = useState(false);
    // Estados para armazenar detalhes do usuário e assinatura
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const [subscription, setSubscription] = useState<Subscription | null>(null);

    // Função para buscar detalhes do usuário
    const getUserDetails = () => supabase.from('users').select('*').single();
    // Função para buscar informações de assinatura
    const getSubscription = () =>
        supabase
            .from('subscriptions')
            .select('*, prices(*, products(*))')
            .in('status', ['trialing', 'active'])
            .single();

    useEffect(() => {
        if (user && !isLoadingData && !userDetails && !subscription) {
            setIsloadingData(true);
            // Busca informações de detalhes do usuário e assinatura em paralelo
            Promise.allSettled([getUserDetails(), getSubscription()]).then(
                (results) => {
                    const userDetailsPromise = results[0];
                    const subscriptionPromise = results[1];

                    // Atualiza os estados com os resultados
                    if (userDetailsPromise.status === 'fulfilled')
                        setUserDetails(userDetailsPromise.value.data as UserDetails);

                    if (subscriptionPromise.status === 'fulfilled')
                        setSubscription(subscriptionPromise.value.data as Subscription);

                    setIsloadingData(false);
                }
            );
        } else if (!user && !isLoadingUser && !isLoadingData) {
            // Define detalhes do usuário e assinatura como nulos quando o usuário não está autenticado
            setUserDetails(null);
            setSubscription(null);
        }
    }, [user, isLoadingUser]);

    // Define o valor do contexto de usuário
    const value = {
        accessToken,
        user,
        userDetails,
        isLoading: isLoadingUser || isLoadingData,
        subscription
    };

    // Fornece o contexto de usuário para componentes descendentes
    return <UserContext.Provider value={value} {...props} />;
};

// Hook personalizado para acessar o contexto de usuário
export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error(`useUser must be used within a MyUserContextProvider.`);
    }
    return context;
};