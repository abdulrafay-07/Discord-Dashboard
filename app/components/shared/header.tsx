interface HeaderProps {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export const Header = ({
  title,
  description,
  children,
}: HeaderProps) => {
  return (
    <div className="w-full flex items-start justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-gray-300">{description}</p>
      </div>
      {children}
    </div>
  )
};
