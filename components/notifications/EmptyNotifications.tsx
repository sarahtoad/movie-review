import { BellOff } from "lucide-react";


export default function EmptyNotifications(){

return (

<div className="
rounded-lg
border border-[#33364A]
bg-[#1B1D2B]
p-10
text-center
">

<BellOff
className="mx-auto mb-4 text-[#8B8FA8]"
size={40}
/>


<h2 className="text-xl font-bold text-white">
Aucune notification
</h2>


<p className="mt-2 text-[#8B8FA8]">
Vous n'avez aucune nouvelle activité.
</p>


</div>

);

}