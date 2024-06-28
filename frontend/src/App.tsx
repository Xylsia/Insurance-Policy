import { BrowserRouter as Router } from "react-router-dom";
import { AppRoutes } from "./routes/AppRoutes";
import { AuthProvider } from "./contexts/AuthContext";
import { SnackbarProvider } from "./contexts/SnackbarContext";
import { Header } from "./components/common/Header/Header";
import { Snackbar } from "./components/common/Snackbar/Snackbar";
import { ThemeSwitcher } from "./components/common/ThemeSwitcher/ThemeSwitcher";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <SnackbarProvider>
        <Router>
          <Header />
          <AppRoutes />
          <Snackbar />
          <ThemeSwitcher />
        </Router>
      </SnackbarProvider>
    </AuthProvider>
  );
}
export default App;
