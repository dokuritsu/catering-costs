import Image from "next/image";
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="grow-3 bg-red-500">Title</div>
      <div className="grow">
        <div className="flex flex-row">
          <div>Card 1</div>
          <div>Card 2</div>
        </div>
      </div>
    </div>
  );
}
