export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full bg-gradient-to-b from-white via-[#f8fbff] to-[#f4f8ff] px-4 py-6">
      {children}
    </div>
  );
}
