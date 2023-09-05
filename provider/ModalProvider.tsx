"use client";

import { useEffect, useState } from "react";


import { ProductWithPrice } from "@/types";
import Modal from "@/components/Modal";

interface ModalProviderProps {
   
}

const ModalProvider = ({
}) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
           <Modal 
           title="teste" description="teste de descrição" isOpen onChange={() => {}}> teste</Modal>
        </>
    );
}

export default ModalProvider;