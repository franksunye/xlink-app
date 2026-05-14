export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="login-page-skin min-h-full px-4 py-4">{children}</div>
  );
}
