import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { MdListAlt } from "react-icons/md";
import Profile from "../profile";

export function Header() {
  const { data: session, status } = useSession();
  return (
    <header className="flex place-content-center">
      <section className="flex w-full max-w-5xl flex-row justify-between py-5">
        <nav className="flex flex-row gap-5">
          <Link href={"/"} className="self-center">
            <h1 className="text-3xl font-bold">
              Tarefas<span className="font-bold text-red-700">+</span>
            </h1>
          </Link>

          {session?.user && (
            <Link
              href={"/dashboard"}
              className="self-center p-2 text-2xl font-bold text-white"
            >
              <button className="flex flex-row justify-center">
                <MdListAlt className="flex self-center" />
                <span className="self-center">Meu painel</span>
              </button>
            </Link>
          )}
        </nav>

        {status === "loading" ? (
          <></>
        ) : session ? (
          <>
            <button
              className="hover:text-bold flex flex-row gap-3 rounded-full border-2 border-solid border-white px-6 py-1 hover:scale-105 hover:bg-white hover:text-black hover:duration-200 "
              onClick={() => signOut()}
            >
              <Profile
                name={session?.user?.name as string}
                image={session?.user?.image as string}
              />
              <span className="self-center">{session?.user?.name}</span>
            </button>
          </>
        ) : (
          <button
            className="hover:text-bold rounded-full border-2 border-solid border-white px-6 py-1 hover:scale-105 hover:border-none hover:bg-white hover:text-black hover:duration-200"
            onClick={() => signIn("google")}
          >
            Acessar
          </button>
        )}
      </section>
    </header>
  );
}
