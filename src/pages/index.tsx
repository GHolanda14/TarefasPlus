import Head from "next/head";
import Image from "next/image";
import heroImg from "../../public/assets/hero.png";
import { GetStaticProps } from "next";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/services/firebaseConnection";

interface HomeProps {
  totalTarefas: number;
  totalComentarios: number;
}

export default function Home({ totalTarefas, totalComentarios }: HomeProps) {
  return (
    <div className="flex h-full">
      <Head>
        <title>Tarefas+ | Organize suas tarefas</title>
      </Head>

      <main className="flex w-full flex-col place-content-center items-center gap-4">
        <div className="flex flex-col place-content-center">
          <Image
            alt="foto de uma tela com 2 pessoas"
            className="sm:max-w-xl"
            src={heroImg}
          />
          <h1 className="text-center font-semibold leading-snug xs:text-2xl sm:text-3xl ">
            Sistema feito para você organizar
            <br /> seus estudos e tarefas
          </h1>
        </div>

        <div className="mb-3 flex flex-col place-content-center justify-between xs:w-4/5 xs:gap-4 sm:w-[470px] sm:flex-row">
          {[`+${totalTarefas} posts`, `+${totalComentarios} comentários`].map(
            (texto) => (
              <button
                key={texto}
                className="text-md rounded bg-slate-200 px-10 py-3 text-black hover:scale-105 hover:bg-slate-300 hover:duration-500 xs:w-full sm:w-fit"
              >
                {texto}
              </button>
            )
          )}
        </div>
      </main>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const tarefasRef = collection(db, "tarefas");
  const comentariosRef = collection(db, "comentarios");

  const tarefasSnap = await getDocs(tarefasRef);
  const comentariosSnap = await getDocs(comentariosRef);

  return {
    props: {
      totalTarefas: tarefasSnap.size || 0,
      totalComentarios: comentariosSnap.size || 0,
    },
    revalidate: 60,
  };
};
