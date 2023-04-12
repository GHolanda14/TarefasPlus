import CardComentario from "@/components/cardComentario";
import { db } from "@/services/firebaseConnection";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { GetServerSideProps } from "next";
import { getSession, signIn, useSession } from "next-auth/react";
import Head from "next/head";
import { useState, useEffect, FormEvent } from "react";

interface User {
  email: string;
  nome: string;
}

interface TarefaProps {
  tarefa: {
    id: string;
    texto: string;
    publica: boolean;
    createdAt: Date;
    user: string;
  };
}

interface Comentario {
  id: string;
  idTarefa: string;
  texto: string;
  createdAt: Date;
  user: User;
}

export default function Tarefa({ tarefa }: TarefaProps) {
  const [inputText, setInputText] = useState("");
  const [comentarios, setComentarios] = useState<Comentario[]>();
  const { data: session } = useSession();

  useEffect(() => {
    async function carregarComentarios() {
      const collRef = collection(db, "comentarios");
      const q = query(
        collRef,
        orderBy("createdAt", "desc"),
        where("idTarefa", "==", tarefa.id)
      );

      let lista;

      onSnapshot(q, (snapshot) => {
        lista = [] as Comentario[];

        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            idTarefa: doc.data()?.idTarefa,
            texto: doc.data()?.texto,
            createdAt: doc.data()?.createdAt,
            user: {
              nome: doc.data()?.user?.nome,
              email: doc.data()?.user?.email,
            },
          });
        });
        setComentarios(lista);
      });
    }
    carregarComentarios();
  }, []);

  const createComentario = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (inputText === "") return;
    if (!session?.user) {
      signIn("google");
      return;
    }

    const comentario = {
      idTarefa: tarefa.id,
      texto: inputText,
      createdAt: new Date(),
      user: {
        nome: session?.user?.name,
        email: session?.user?.email,
      },
    } as Comentario;

    try {
      await addDoc(collection(db, "comentarios"), comentario)
        .then(() => console.log("Cadastrou"))
        .catch((err) => console.log("Deu ruim: ", err));
    } catch (err) {
      console.log("Catch: ", err);
    }

    setInputText("");
  };

  return (
    <div className="2xl:h-full flex flex-col place-items-center gap-5 bg-white ">
      <Head>
        <title>Detalhes da tarefa</title>
      </Head>
      <div className="mt-5 flex w-full max-w-5xl flex-col gap-3 text-black">
        <h1 className="text-3xl font-semibold">Tarefa</h1>
        <p className="w-full resize-none whitespace-pre-wrap rounded-md border-2 border-solid border-slate-400 px-3 py-2 text-black">
          {tarefa?.texto}
        </p>
      </div>

      <div className="flex w-full max-w-5xl flex-col gap-3 text-black">
        <h1 className="text-xl font-semibold">Deixar comentário</h1>
        <form onSubmit={(e) => createComentario(e)}>
          <textarea
            className="w-full resize-none rounded-md border-2 border-solid border-slate-400 px-3 py-2 font-mono font-medium text-black"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Comente o que achou desta tarefa..."
            rows={4}
          />
          <button
            type="submit"
            className="w-full rounded-sm bg-sky-500 p-2 text-lg text-white hover:bg-sky-300"
          >
            Enviar comentário
          </button>
        </form>
      </div>
      <div className="flex w-full max-w-5xl flex-col gap-3 text-black">
        <h1 className="text-xl font-semibold">Comentários</h1>
        <div className="mb-3 flex max-h-80 w-full max-w-5xl flex-col overflow-y-auto">
          {comentarios && comentarios.length > 0 ? (
            comentarios.map((comment) => (
              <CardComentario
                key={comment?.id}
                user={comment?.user}
                idTarefa={comment?.idTarefa}
                id={comment?.id}
                createdAt={comment?.createdAt}
                texto={comment?.texto}
              />
            ))
          ) : (
            <p>Sem comentários galera</p>
          )}
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params?.id as string;

  const docRef = doc(db, "tarefas", id);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists() || !snapshot.data()?.publica) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const milisegundos = snapshot.data()?.createdAt.seconds * 1000;

  const tarefa = {
    id: snapshot.id,
    texto: snapshot.data()?.tarefa,
    publica: snapshot.data()?.publica,
    createdAt: new Date(milisegundos).toLocaleDateString(),
    user: snapshot.data()?.user,
  };

  return {
    props: {
      tarefa,
    },
  };
};
