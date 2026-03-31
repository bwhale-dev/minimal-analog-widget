import { Outlet } from "react-router";

export function Layout() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#fefdfb]">
      <main className="flex flex-col items-center justify-center w-full">
        {/* ここに時計が表示されます */}
        <Outlet />
      </main>
    </div>
  );
}