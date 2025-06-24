// components/FullScreenLoader.js
import { LoaderIcon } from "lucide-react";

export default function FullScreenLoader() {
    return (
        <div className="flex items-center justify-center h-screen w-full">
            <LoaderIcon className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>


    );
}
