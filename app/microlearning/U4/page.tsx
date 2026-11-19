
import { Suspense } from "react";
import MicrolearningUnitContent from "@/components/microlearning/MicrolearningUnitContent";

export default function Page() {
    return (
        <Suspense fallback={<p className="p-8 text-slate-500">Memuat...</p>}>
            <MicrolearningUnitContent unitNumber={4} />
        </Suspense>
    );
}
