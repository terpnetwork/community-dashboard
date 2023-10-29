import { ThemeProvider } from "@/components/utils/theme-provider";
import { ModeToggle } from "@/components/utils/mode-toggle";

interface RootLayoutProps {
  children?: React.ReactNode;
}

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="bg-background text-foreground relative">
        <div className="absolute right-10 top-10 p-10 ">
          <ModeToggle />
        </div>
        {children}
      </div>
    </ThemeProvider>
  );
}
