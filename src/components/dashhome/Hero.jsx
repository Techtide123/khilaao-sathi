import { ExternalLink } from "lucide-react";
import { Typewriter } from 'react-simple-typewriter';
import { cn } from "@/lib/utils";

import { Button, buttonVariants } from "@/components/ui/button";
import { Globe } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative overflow-hidden py-32">
            <div className="absolute inset-x-0 top-0 flex h-full w-full items-center justify-center opacity-100">
                <img
                    alt="background"
                    src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/patterns/square-alt-grid.svg"
                    className="[mask-image:radial-gradient(75%_75%_at_center,white,transparent)] opacity-90"
                />
            </div>
            <div className="relative z-10 container">
                <div className="mx-auto flex max-w-5xl flex-col items-center">
                    <div className="flex flex-col items-center gap-6 text-center">
                        <div className="rounded-xl bg-background/30 p-4 shadow-sm backdrop-blur-sm">
                            <img
                                src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/block-1.svg"
                                alt="logo"
                                className="h-16"
                            />
                        </div>
                        <div>
                            <h1 className="mb-6 text-2xl font-bold tracking-tight text-pretty lg:text-5xl">
                                Khilaoo Sathi — {' '}
                                <span className="text-[#580FC2]">
                                    <Typewriter
                                        words={[
                                            'अन्नदानं परं दानम्।',
                                            'भूख से बड़ी कोई भूख नहीं',
                                            'साथ मिलकर खिलाओ'
                                        ]}
                                        loop={0}
                                        cursor
                                        cursorStyle="_"
                                        typeSpeed={100}
                                        deleteSpeed={50}
                                        delaySpeed={1000}
                                    />
                                </span>
                            </h1>
                            <p className="mx-auto max-w-3xl text-muted-foreground lg:text-xl">
                                Wasting food is a missed opportunity to serve humanity. What’s extra for you could be everything for someone else. Share with the hungry, and let your plate become someone’s peace.
                            </p>
                        </div>
                        <div className="mt-6 flex justify-center gap-3">
                            <Button className="shadow-sm transition-shadow hover:shadow">
                                Get Started
                            </Button>
                            <Button variant="outline" className="group">
                                Learn more{" "}
                                <ExternalLink className="ml-2 h-4 transition-transform group-hover:translate-x-0.5" />
                            </Button>
                        </div>
                        <div className="mt-20 flex flex-col items-center gap-5">
                            <p className="font-medium text-muted-foreground lg:text-left">
                                Build Your Projects with Me
                            </p>
                            <div className="flex flex-wrap items-center justify-center gap-4">
                                {/* GitHub */}
                                <a
                                    href="https://github.com/Shitansu7205"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={cn(
                                        buttonVariants({ variant: "outline" }),
                                        "group flex aspect-square h-12 items-center justify-center p-0"
                                    )}
                                >
                                    <img
                                        src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
                                        alt="GitHub"
                                        className="h-6 saturate-0 transition-all group-hover:saturate-100"
                                    />
                                </a>

                                {/* LinkedIn */}
                                <a
                                    href="https://www.linkedin.com/in/shitansu-kumar-gochhayat-91b7a5241/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={cn(
                                        buttonVariants({ variant: "outline" }),
                                        "group flex aspect-square h-12 items-center justify-center p-0"
                                    )}
                                >
                                    <img
                                        src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg"
                                        alt="LinkedIn"
                                        className="h-6 saturate-0 transition-all group-hover:saturate-100"
                                    />
                                </a>

                                {/* Twitter/X */}
                                <a
                                    href="https://x.com/ShitansuG"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={cn(
                                        buttonVariants({ variant: "outline" }),
                                        "group flex aspect-square h-12 items-center justify-center p-0"
                                    )}
                                >
                                    <img
                                        src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/twitter/twitter-original.svg"
                                        alt="Twitter"
                                        className="h-6 saturate-0 transition-all group-hover:saturate-100"
                                    />
                                </a>

                                {/* Gmail (Optional) */}
                              <a
  href="https://shitansu-portfolio.netlify.app/"
  target="_blank"
  rel="noopener noreferrer"
  className={cn(
    buttonVariants({ variant: "outline" }),
    "group flex aspect-square h-12 items-center justify-center p-0"
  )}
>
 <Globe className="h-6 w-6 text-zinc-600 dark:text-zinc-300 group-hover:text-indigo-600 transition-all" />
</a>


                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};


