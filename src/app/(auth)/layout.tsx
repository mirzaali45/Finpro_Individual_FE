// src/app/(auth)/layout.tsx
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script src="https://accounts.google.com/gsi/client" async defer></script>
      {children}
    </>
  );
}
