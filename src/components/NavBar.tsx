import Image from "next/image";
import { IoBagOutline, IoHeartOutline, IoPersonOutline, IoSearchOutline } from "react-icons/io5";

export default function NavBar() {
    return (
        <nav className="flex justify-center items-center w-full h-16 bg-white text-black drop-shadow-(--nav-shadow) z-10">
            <div className="flex lg:grid lg:grid-cols-3 justify-between items-center w-full mx-(--gutter) lg:mx-(--gutter-md)">
                <div className="flex lg:col-start-2 lg:justify-center">
                    <Image
                        src="/dbwearopt.svg"
                        alt="DB-Wear logomark"
                        width={120}
                        height={120}
                    />
                </div>
                <div className="flex gap-6 lg:col-start-3 lg:justify-end">
                    <div className="hover:scale-125 transition">
                        <IoSearchOutline />
                    </div>
                    <div className="hover:scale-125 transition">
                        <IoHeartOutline />
                    </div>
                    <div className="hover:scale-125 transition">
                        <IoBagOutline />
                    </div>
                    <div className="hover:scale-125 transition">
                        <IoPersonOutline />
                    </div>
                </div>
            </div>
        </nav>
    );
}
