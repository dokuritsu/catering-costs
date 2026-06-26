import Image from "next/image";
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="grow-3 flex flex-col justify-center px-12">
        <p className="text-sm tracking-widest font-medium uppercase text-[#594157]">CocinaCosto</p>
        <div className="w-12 h-1 rounded bg-[#726DA8]"></div>
        <h1 className="text-6xl font-serif font-bold text-[#594157]">
          Before you cook,
          <br />
          <span className="text-[#726DA8]"> know your worth</span>
        </h1>
        <p className="text-base text-left text-[#594157]/75 max-w-96 mt-4">
          Calculate the true cost of every order - food, labor, deliver - and find out if it's worth your time before you turn on the stove.
        </p>
      </div>
      <div className="grow">
        <div className="flex flex-row">
          <div>Card 1</div>
          <div>Card 2</div>
        </div>
      </div>
    </div>
  );
}
