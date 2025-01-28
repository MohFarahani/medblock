import ThemeRegistry from './ThemeRegistry';

export const metadata = {
  title: 'Software Engineer- MedBlock',
  description: 'Created with Next.js and MUI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}