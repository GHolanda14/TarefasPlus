import { db } from "@/services/firebaseConnection";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import Link from "next/link";
import { MdOutlineShare, MdDelete } from "react-icons/md";

interface Tarefa {
  texto: string;
  publica: boolean;
  id: string;
}

const handleShare = async (id: string) => {
  await navigator.clipboard.writeText(
    `${process.env.NEXT_PUBLIC_URL}/tarefa/${id}`
  );

  alert("URL copiada com sucesso!");
};

const handleDelete = async (id: string) => {
  const taskRef = doc(db, "tarefas", id);
  const comentariosRef = collection(db, "comentarios");

  const q = query(comentariosRef, where("idTarefa", "==", id));
  const snapshot = await getDocs(q);

  snapshot.forEach(async (doc) => {
    await deleteDoc(doc.ref);
  });

  await deleteDoc(taskRef);
};

export default function CardTarefa(tarefa: Tarefa) {
  return (
    <div className="m-3 flex flex-col gap-2 rounded-md border-2 border-solid border-slate-400 p-3">
      {tarefa.publica && (
        <div
          className="flex flex-row gap-2 hover:cursor-pointer"
          onClick={() => handleShare(tarefa.id)}
        >
          <label className="rounded-sm bg-sky-600 p-1 text-xs uppercase hover:cursor-pointer">
            Público
          </label>
          <MdOutlineShare className="text-2xl text-sky-600" />
        </div>
      )}

      <div className="flex flex-row justify-between">
        {tarefa.publica ? (
          <Link href={`tarefa/${tarefa.id}`} className="max-w-[97%]">
            <p className=" whitespace-pre-wrap text-black">{tarefa.texto}</p>
          </Link>
        ) : (
          <p className="max-w-[97%] whitespace-pre-wrap text-black">
            {tarefa.texto}
          </p>
        )}

        <MdDelete
          className="cursor-pointer text-2xl text-red-500"
          onClick={() => handleDelete(tarefa.id)}
        />
      </div>
    </div>
  );
}
