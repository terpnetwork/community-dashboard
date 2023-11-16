import { ThemeProvider } from "@/components/utils/theme-provider";
import { ModeToggle } from "@/components/utils/mode-toggle";
import StyledPointer from "./utils/styled-pointer";

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
