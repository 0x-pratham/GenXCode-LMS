import { LogOut } from "lucide-react";
import { logoutUser } from "@/app/actions/authActions";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  return (
    <form action={logoutUser} className="w-full">
      <Button 
        type="submit" 
        variant="ghost" 
        className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-500/10 h-12"
      >
        <LogOut className="mr-3 w-5 h-5" />
        <div className="font-medium">Sign Out</div>
      </Button>
    </form>
  );
}