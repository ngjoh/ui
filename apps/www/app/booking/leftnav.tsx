import Link from "next/link";

export default function LeftNav(){
    return  <div className="w-40 bg-zinc-700 text-white">
    <div className="p-2 text-lg font-bold uppercase " ><Link href="/koksmat">Koksmat</Link></div>
    <div className='p-2'>
        <Link href="/koksmat/admin">Administration</Link>
    </div>
    </div>


}