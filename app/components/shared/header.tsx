import { Badge } from "~/components/ui/badge";

interface HeaderProps {
  title: string;
  description?: string;
};

export const Header = ({
  title,
  description
}: HeaderProps) => {
  return (
    <div className="w-full flex items-start justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-gray-300">{description}</p>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="flex items-center gap-1.5 text-sm">
          <span className="h-2 w-2 rounded-full bg-green-500"></span>
          Bot Online
        </Badge>
      </div>
    </div>
  )
};
