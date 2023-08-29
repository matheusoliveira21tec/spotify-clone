// Importando as dependências necessárias
"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaPlay } from "react-icons/fa";

// Definindo a interface para as propriedades do ListItem
interface ListItemProps {
    image: string;
    name: string;
    href: string;
}

// Definindo o componente ListItem como uma função de componente React
const ListItem: React.FC<ListItemProps> = ({
    image,
    name,
    href,
}) => {
    const router = useRouter(); // Obtendo o objeto router para manipular a navegação

    return (
        <button
            onClick={() => { }}
            className="relative group flex items-center rounded-md overflow-hidden gap-x-4 
            bg-neutral-100/10 cursor-pointer  hover:bg-neutral-100/20 transition pr-4">
            <div className="relative min-h-[64px] min-w-[64px]">
                {/* Utilizando a tag Image do Next.js para exibir a imagem */}
                <Image className="object-cover" src={image} fill alt="Image" />
            </div>
            <p className="font-medium truncate py-5">
                {name} {/* Exibindo o nome */}
            </p>
            <div
                className="absolute transition opacity-0 rounded-full flex items-center justify-center 
                  bg-green-500 p-4 drop-shadow-md right-5group-hover:opacity-100 hover:scale-110">
                {/* Ícone de play usando o componente FaPlay do pacote react-icons */}
                <FaPlay className="text-black" />
            </div>
        </button>
    );
}

// Exportando o componente ListItem
export default ListItem;