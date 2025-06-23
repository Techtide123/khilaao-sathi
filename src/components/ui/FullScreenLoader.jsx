// components/FullScreenLoader.js
import { Loader2 } from "lucide-react";

export default function FullScreenLoader() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-xs">
            <Loader2 className="h-10 w-10 animate-spin text-white" />
        </div>


    );
}
