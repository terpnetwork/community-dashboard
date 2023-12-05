import { ThemeProvider } from "@/components/utils/theme-provider";

interface RootLayoutProps {
  children?: React.ReactNode;
}

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <ThemeProvider attribute="class" forcedTheme="dark" >
      <div className="bg-background text-foreground relative">
        <div className="absolute right-10 top-10 p-10 ">

        </div>
        {children}
      </div>
    </ThemeProvider>
  );
}
