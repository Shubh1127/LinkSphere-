import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout/UserPage";

export default function Discover(){
    return (
        <UserLayout>
        <DashboardLayout>
            <div className="discoverContainer">
            <h1>Discover</h1>
            {/* Add your discover content here */}
            </div>
        </DashboardLayout>
        </UserLayout>
    );
}