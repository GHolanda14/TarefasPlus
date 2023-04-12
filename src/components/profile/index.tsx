import Image from "next/image";

interface Usuario {
  name: string;
  image: string;
}

export default function Profile({ name, image }: Usuario) {
  return (
    <>
      <Image
        width={40}
        height={40}
        className="rounded-full"
        alt={name}
        src={image}
      />
    </>
  );
}
