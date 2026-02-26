import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";


export const metadata = {
    title: "OohPoint Dashboard",
    description: "OOH Media Management Platform",
};

export default function RootLayout({ children }) {
    return (
        <div className="flex">
            {/* Sidebar */}
            <Sidebar />

            {/* Main content */}
            <div className="flex-1 flex min-h-screen flex-col">
                <Header />

                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}