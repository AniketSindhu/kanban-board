import './globals.css';

export const metadata = {
  title: 'SUKI Command Center',
  description: 'Build. Ship. Dominate.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}