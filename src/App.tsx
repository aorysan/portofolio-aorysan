import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { HashRouter, Routes, Route } from "react-router-dom";
import SmoothScroll from "@/components/SmoothScroll";
import Index from "./pages/Index";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" enableSystem={false}>
      <TooltipProvider>
        <SmoothScroll>
          <Toaster />
          <Sonner />
          <HashRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="*" element={<Index />} />
            </Routes>
          </HashRouter>
        </SmoothScroll>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
