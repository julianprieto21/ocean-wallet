type CardProps = {
  children: React.ReactNode;
  className?: string;
};
export function Card({ children, className }: CardProps) {
  return (
    <div className={`bg-primary-50 w-full rounded-2xl p-6 ${className}`}>
      {children}
    </div>
  );
}
