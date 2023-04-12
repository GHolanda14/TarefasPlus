import CardTarefa from "@/components/cardTarefa";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

import { db } from "@/services/firebaseConnection";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";

interface HomeProps {
  user: {
    email: string;
  };
}

interface TaskProps {
  id: string;
  createdAt: Date;
  publica: boolean;
  tarefa: string;
  user: string;
}

export default function Dashboard({ user }: HomeProps) {
  const [tarefa, setTarefa] = useState("");
  const [publica, setPublica] = useState(false);
  const [listaTarefas, setListaTarefas] = useState<TaskProps[]>();

  useEffect(() => {
    async function carregarTarefas() {
      const tarefasRef = collection(db, "tarefas");
      const q = query(
        tarefasRef,
        orderBy("createdAt", "desc"),
        where("user", "==", user?.email)
      );

      onSnapshot(q, (snapshot) => {
        let lista = [] as TaskProps[];

        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            createdAt: doc.data().createdAt,
            publica: doc.data().publica,
            tarefa: doc.data().tarefa,
            user: doc.data().user,
          });
        });
        setListaTarefas(lista);
      });
    }

    carregarTarefas();
  }, [user?.email]);

  const cadastrarTarefa = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (tarefa.trim() === "") return;

    try {
      await addDoc(collection(db, "tarefas"), {
        tarefa,
        publica,
        user: user?.email,
        createdAt: new Date(),
      });
    } catch (err) {
      console.log("Deu erro: ", err);
    }

    setPublica(false);
    setTarefa("");
  };

  return (
    <div className="flex h-full min-w-full flex-col place-items-center gap-3">
      <Head>
        <title>Meu painel</title>
      </Head>
      <section className="flex w-full max-w-5xl flex-col gap-4 bg-transparent">
        <h2 className="text-2xl font-bold">Qual sua tarefa?</h2>
        <form
          className="flex flex-col gap-2"
          onSubmit={(e) => cadastrarTarefa(e)}
        >
          <textarea
            className="resize-none rounded-md px-3 py-2 font-mono font-medium text-black"
            placeholder="Digite qual sua tarefa..."
            value={tarefa}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setTarefa(e.target.value)
            }
            rows={7}
          />
          <div className="flex flex-row gap-2">
            <input
              id="publica"
              type="checkbox"
              checked={publica}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setPublica(e.target.checked);
              }}
              value="Sim"
              className="hover:cursor-pointer"
            />
            <label className="hover:cursor-pointer" htmlFor="publica">
              Deixar tarefa pública?
            </label>
          </div>
          <button
            type="submit"
            className="rounded-sm bg-sky-500 p-2 text-lg text-white hover:bg-sky-300"
          >
            Registrar
          </button>
        </form>
      </section>
      <section className="mt-4 flex h-full max-h-[700px] w-full flex-col place-items-center gap-4 bg-white">
        <h2 className="mt-3 text-center text-3xl font-bold text-black md:mt-5">
          Minhas tarefas
        </h2>
        <div className="w-full max-w-5xl">
          {listaTarefas && listaTarefas?.length > 0 ? (
            listaTarefas.map((task) => (
              <CardTarefa
                key={task.id}
                id={task.id}
                texto={task.tarefa}
                publica={task.publica}
              />
            ))
          ) : (
            <p className="text-black">
              Você ainda não cadastrou nenhuma tarefa
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  if (!session?.user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: {
        email: session?.user?.email,
      },
    },
  };
};
