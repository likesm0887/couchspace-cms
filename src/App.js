import { boot } from "./service/ServicePool";
import { RouterProvider } from "react-router-dom";
import { router } from "./router.tsx";
import { AuthProvider } from "./features/auth/AuthContext.tsx";

function App() {
  // registerServiceWorker()
  // Notification()
  boot();
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
