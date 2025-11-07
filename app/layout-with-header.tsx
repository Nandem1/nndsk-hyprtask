import { Header } from '@/components/header';
import { ThemeProviderContext } from '@/components/theme-provider-context';

export default function LayoutWithHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProviderContext>
      <div className="min-h-screen bg-background">
        <Header />
        <main>{children}</main>
      </div>
    </ThemeProviderContext>
  );
}

