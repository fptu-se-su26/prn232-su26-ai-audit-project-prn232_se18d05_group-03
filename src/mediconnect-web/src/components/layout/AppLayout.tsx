import { Outlet } from "react-router-dom";
import Header from "./Header";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
