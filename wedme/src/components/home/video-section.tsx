import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * Seção editorial premium após o hero.
 * Imagem grande com overlay + tagline + CTA.
 */
export function VideoSection() {
  return (
    <section className="py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Card editorial com imagem */}
        <div className="relative rounded-xl overflow-hidden">
          <div className="relative aspect-[16/9] md:aspect-[21/9]">
            <Image
              src="https://welucci.com/wp-content/uploads/2026/01/wetogether-0009-1_11zon-scaled.jpg"
              alt="Casal celebrando em espaço Welucci"
              fill
              sizes="(max-width: 768px) 100vw, 80vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
          </div>

          <div className="absolute inset-0 flex items-center">
            <div className="px-8 md:px-16 max-w-lg">
              <p className="text-xs md:text-sm font-medium tracking-widest text-white/70 uppercase mb-3">
                Planejamento 100% digital
              </p>
              <h2 className="font-display font-medium text-2xl md:text-4xl lg:text-5xl text-white leading-[1.1] tracking-editorial">
                O casamento dos seus sonhos, do início ao sim.
              </h2>
              <Link
                href="/comece"
                className="mt-6 md:mt-8 inline-flex items-center gap-2 min-h-11 px-6 py-3 rounded-md bg-white/95 text-foreground text-sm font-medium tracking-wide hover:bg-white hover:shadow-lg hover:-translate-y-[1px] active:translate-y-0 transition-all duration-300 ease-out backdrop-blur-sm"
              >
                Começar agora
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
