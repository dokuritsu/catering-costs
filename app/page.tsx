import Image from "next/image";
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="grow-3 flex flex-col justify-center px-12">
        <p className="text-lg tracking-widest font-medium uppercase text-[#594157] p-1">CocinaCosto</p>
        <div className="w-18 h-1 rounded bg-[#726DA8] my-10"></div>
        <h1 className="text-8xl tracking-tight font-serif font-bold text-[#594157]">
          Before you cook,
          <br />
          <span className="tracking-tight text-[#726DA8]"> know your worth.</span>
        </h1>
        <p className="text-lg text-left text-[#594157]/75 max-w-96 mt-4">
          Calculate the true cost of every order - food, labor, deliver - and find out if it's worth your time before you turn on the stove.
        </p>
      </div>
      <div className="grow px-12">
        <div className="flex flex-row justify-center gap-12">
          <Link href="/quote" className="grow rounded-3xl text-[#594157] bg-[#FFFFFF] border-2 border-transparent hover:border-[#726DA8] p-10">
            <p className="text-sm tracking-widest uppercase text-[#594157] mb-4">Quotes</p>
            <h2 className="text-2xl font-semibold text-[#594157] mb-4">Calculate an order</h2>
            <p className="text-base font-medium text-[#594157]/75">Enter your costs and margin to get a suggested price and see your profit.</p>
          </Link>
          <Link href="/dishes" className="grow rounded-3xl text-[#594157] bg-[#FFFFFF] border-2 border-transparent hover:border-[#726DA8] p-10">
            <p className="text-sm tracking-widest uppercase text-[#594157] mb-4">Dishes</p>
            <h2 className="text-2xl font-semibold text-[#594157] mb-4">Manage my dishes</h2>
            <p className="text-base font-medium text-[#594157]/75">Add, edit, and organize the dishes you sell with their baseline costs.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
