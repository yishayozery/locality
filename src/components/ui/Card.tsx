interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-2xl bg-white p-6 shadow-md transition-shadow hover:shadow-lg ${className}`}
    >
      {children}
    </div>
  );
}
