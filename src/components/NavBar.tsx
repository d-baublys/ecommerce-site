import Image from "next/image";
import { IoBagOutline, IoHeartOutline, IoPersonOutline, IoSearchOutline } from "react-icons/io5";

export default function NavBar() {
    return (
        <nav className="flex justify-center items-center w-full h-16 bg-white text-black drop-shadow-(--nav-shadow) z-10">
            <div className="flex justify-between items-center w-full mx-4">
                <Image src="/dbwearopt.svg" alt="DB-Wear logomark" width={120} height={120} />
                <div className="flex gap-6">
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
