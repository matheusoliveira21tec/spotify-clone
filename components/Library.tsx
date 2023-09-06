"use client";
import { TbPlaylist } from "react-icons/tb";
import { AiOutlinePlus } from "react-icons/ai";
import { useUser } from "@/hooks/useUser";
import useAuthModal from "@/hooks/useAuthModal";
const Library = () => {
    const { user, subscription } = useUser();
    const authModal = useAuthModal();
    const onClick = () => {
        if (!user) {
            return authModal.onOpen();
        }
    }

    return (
        <div className="flex flex-col">
            <div className="flex items-center justify-between px-5 pt-4">
                <div className="inline-flex items-center gap-x-2">
                    <TbPlaylist className="text-neutral-400" size={26} />
                    <p className="text-neutral-400 font-medium text-md">
                        Your Library
                    </p>
                </div>
                <AiOutlinePlus
                    onClick={onClick}
                    size={20}
                    className="
              text-neutral-400 
              cursor-pointer 
              hover:text-white 
              transition
            "
                />
            </div>

        </div>
    );
}

export default Library;