import { notFound } from "next/navigation";
import DevPreviewShell from "@/components/microlearning/DevPreviewShell";

export default function MicrolearningPreviewPage() {
    if (process.env.NODE_ENV === "production") {
        notFound();
    }

    return <DevPreviewShell />;
}
