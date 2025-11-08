import { Card, CardBody, Chip } from "@material-tailwind/react";
import { ReactNode } from "react";

interface SectionCardProps {
  badge?: string;
  title: string;
  children: ReactNode;
  className?: string;
}

export default function SectionCard({ badge, title, children, className = "" }: SectionCardProps) {
  return (
    <Card className={`bg-ink/80 border border-slate/20 hover:transform hover:-translate-y-1 transition-all ${className}`}>
      <CardBody>
        {badge && (
          <Chip
            value={badge}
            size="sm"
            className="mb-3 bg-royal/20 border border-royal/40 text-current w-fit"
          />
        )}
        <h3 className="font-heading font-bold text-xl mb-3">{title}</h3>
        <div className="text-slate">{children}</div>
      </CardBody>
    </Card>
  );
}
