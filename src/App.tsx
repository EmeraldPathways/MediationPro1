import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Index";
import CalendarPage from "./pages/Calendar";
import Email from "./pages/Email"; // Add import for Email
import NewSessionPage from "./pages/NewSession";
import NotesPage from "./pages/Notes";
import NewNotePage from "./pages/NewNote";
import TemplatesPage from "./pages/Templates";
import StoragePage from "./pages/Storage";
import CaseFilesPage from "./pages/CaseFiles";
import CaseDetailPage from "./pages/CaseDetail";
import TasksPage from "./pages/Tasks";
import MeetingNotesPage from "./pages/MeetingNotes";
import ContactsPage from "./pages/Contacts";
import BillingPage from "./pages/Billing";
import DocumentsPage from "./pages/Documents";
import ReportsPage from "./pages/Reports";
import SettingsPage from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/email" element={<Email />} /> {/* Add route for Email */}
          <Route path="/calendar/new" element={<NewSessionPage />} />
          <Route path="/case-files" element={<CaseFilesPage />} />
          <Route path="/case-files/:id" element={<CaseDetailPage />} />
          <Route path="/matters" element={<Navigate to="/case-files" replace />} />
          <Route path="/matters/:id" element={<Navigate to="/case-files/:id" replace />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/billing" element={<BillingPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/meeting-notes" element={<MeetingNotesPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/notes/new" element={<NewNotePage />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/storage" element={<StoragePage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;