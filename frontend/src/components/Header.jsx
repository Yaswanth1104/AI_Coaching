import { FiBell } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";

export default function Header() {
  return (
    <header className="h-24 bg-[#070B1D] border-b border-slate-800 flex items-center justify-between px-10">

      <div>

        <h1 className="text-5xl font-bold text-white">

          AI Customer Support Coaching Dashboard

        </h1>

        <p className="text-slate-400 mt-2">

          Multi-Agent AI Customer Support Coaching Platform

        </p>

      </div>

      <div className="flex items-center gap-6">

        <FiBell
          className="text-slate-300"
          size={26}
        />

        <FaUserCircle
          className="text-purple-500"
          size={42}
        />

      </div>

    </header>
  );
}