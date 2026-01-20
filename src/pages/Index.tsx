import { useState } from "react";
import Header from "@/components/Header";
import SportsTabs from "@/components/SportsTabs";
import Sidebar from "@/components/Sidebar";
import OddsTable from "@/components/OddsTable";
import Footer from "@/components/Footer";
import RecentOrders from "@/components/RecentOrders";
import MobileHeader from "@/components/MobileHeader";
import MobileSportsTabs from "@/components/MobileSportsTabs";
import MobileFilterTabs from "@/components/MobileFilterTabs";
import MobileOddsTable from "@/components/MobileOddsTable";
import MobileBottomNav from "@/components/MobileBottomNav";
import MobileSidebar from "@/components/MobileSidebar";
import Betslip from "@/components/Betslip";
import DesktopBetslipButton from "@/components/DesktopBetslipButton";

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Desktop Header */}
      <Header />
      
      {/* Mobile Header */}
      <MobileHeader onMenuClick={() => setSidebarOpen(true)} />
      
      {/* Mobile Sidebar */}
      <MobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Desktop Sports Tabs */}
      <SportsTabs />
      
      {/* Mobile Sports & Filter Tabs */}
      <MobileSportsTabs />
      <MobileFilterTabs />
      
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <Sidebar />
        
        {/* Desktop Odds Table */}
        <OddsTable />
        
        {/* Mobile Odds Table */}
        <MobileOddsTable />
      </div>
      
      {/* Desktop Only */}
      <RecentOrders />
      <Footer />
      
      {/* Betslip Panel */}
      <Betslip />
      
      {/* Desktop Betslip Button */}
      <DesktopBetslipButton />
      
      {/* Mobile Bottom Navigation - with spacer for fixed nav */}
      <div className="h-14 md:hidden flex-shrink-0"></div>
      <MobileBottomNav />
    </div>
  );
};

export default Index;
