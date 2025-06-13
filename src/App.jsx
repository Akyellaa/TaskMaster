import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TaskProvider } from "./context/TaskContext";
import { AuthProvider } from "./context/AuthContext";
import { CategoryProvider } from "./context/CategoryContext";
import AuthModal from "./components/Auth/AuthModal";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CategoriesPage from "./pages/CategoriesPage";
import { useAuth } from "./context/AuthContext";

const queryClient = new QueryClient();

// Wrap the routes with authentication
const AuthenticatedApp = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <AuthModal open={!isAuthenticated} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CategoryProvider>
        <TaskProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AuthenticatedApp />
          </TooltipProvider>
        </TaskProvider>
      </CategoryProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;