import { db } from "@/services/firebaseConnection";
import { deleteDoc, doc } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { MdDelete } from "react-icons/md";

interface User {
  nome: string;
  email: string;
}

interface Comentario {
  id: string;
  idTarefa: string;
  texto: string;
  createdAt: Date;
  user: User;
}

export default function CardComentario(comentario: Comentario) {
  const { data: session } = useSession();
  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "comentarios", id)).then(() =>
        console.log("Deletado com sucesso!")
      );
    } catch (err) {
      console.log(err);
    }
    return;
  };

  return (
    <div className="m-3 flex flex-col gap-2 rounded-md border-2 border-solid border-slate-400 p-3">
      <div className="flex flex-row gap-2">
        <label className="rounded-sm bg-slate-300 p-1 text-xs capitalize hover:cursor-pointer">
          {comentario?.user?.nome}
        </label>
        {comentario?.user?.email === session?.user?.email && (
          <MdDelete
            className="cursor-pointer text-2xl text-red-500"
            onClick={() => handleDelete(comentario.id)}
          />
        )}
      </div>

      <div className="flex flex-row justify-between">
        <p className="max-w-[97%] text-black">{comentario.texto}</p>
      </div>
    </div>
  );
}
