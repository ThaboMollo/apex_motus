import Link from "next/link";
import { Button, Card, CardBody, Chip } from "@material-tailwind/react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-navy/75 to-transparent">
      <div className="absolute right-[-10vw] top-[-10vh] w-[60vw] h-[60vw] min-w-[520px] pointer-events-none opacity-50 blur-[40px]">
        <div className="w-full h-full bg-gradient-radial from-cyan/30 via-royal/30 to-transparent" />
      </div>

      <div className="container mx-auto px-5 max-w-7xl py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <Chip
              value="Corporate Holding Company • Johannesburg, South Africa"
              className="mb-4 bg-cyan/10 border border-cyan/30 text-current normal-case font-normal"
            />
            <div className="text-gold font-extrabold tracking-widest text-xs uppercase mb-3">
              Apex Predator Philosophy
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-4">
              We hunt for category leadership — then engineer it to last.
            </h1>
            <p className="text-lg md:text-xl text-slate max-w-2xl mb-8">
              Apex Motus is a corporate holding company. We design and operate ventures to be the
              best in their industries: trusted, future‑ready, and technologically dominant. Systems
              over heroics. Cash‑flow before vanity. Compounding forever.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/portfolio">
                <Button color="cyan" size="lg" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}>
                  Explore portfolio
                </Button>
              </Link>
              <Link href="/#thesis">
                <Button variant="outlined" color="blue" size="lg" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}>
                  Read our thesis
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="space-y-4">
              <Card className="bg-ink/80 border border-slate/20">
                <CardBody>
                  <div className="flex items-center gap-2 flex-wrap text-sm font-bold">
                    <span>👑 Trust</span>
                    <span>•</span>
                    <span>🧠 Technology</span>
                    <span>•</span>
                    <span>🛡️ Discipline</span>
                    <span>•</span>
                    <span>⚡ Dominance</span>
                  </div>
                </CardBody>
              </Card>

              <Card className="bg-ink/80 border border-slate/20 hover:transform hover:-translate-y-1 transition-all">
                <CardBody>
                  <Chip
                    value="Corporate"
                    size="sm"
                    className="mb-2 bg-royal/20 border border-royal/40 text-current w-fit"
                  />
                  <h3 className="font-heading font-bold text-xl mb-2">Holding Company</h3>
                  <p className="text-slate text-sm">
                    Structured as a corporate with centralized shared services. Built for stability,
                    speed, and optionality.
                  </p>
                </CardBody>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-ink/80 border border-slate/20 hover:transform hover:-translate-y-1 transition-all">
                  <CardBody>
                    <Chip
                      value="Automation"
                      size="sm"
                      className="mb-2 bg-royal/20 border border-royal/40 text-current w-fit"
                    />
                    <h3 className="font-heading font-bold text-lg mb-2">Operate Lean</h3>
                    <p className="text-slate text-xs">
                      Documentation, SOPs, and automation that create leverage across all brands.
                    </p>
                  </CardBody>
                </Card>

                <Card className="bg-ink/80 border border-slate/20 hover:transform hover:-translate-y-1 transition-all">
                  <CardBody>
                    <Chip
                      value="Focus"
                      size="sm"
                      className="mb-2 bg-royal/20 border border-royal/40 text-current w-fit"
                    />
                    <h3 className="font-heading font-bold text-lg mb-2">Apex Predator</h3>
                    <p className="text-slate text-xs">
                      We only build where we can be #1 in the space, not #also‑ran.
                    </p>
                  </CardBody>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
