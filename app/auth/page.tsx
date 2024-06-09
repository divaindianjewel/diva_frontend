// pages/index.tsx
"use client"
import Login from "@/components/custom/Login";
import LoginDialog from "@/components/custom/LoginDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";

const Home: React.FC = () => {
  return (
    <div>
      <LoginDialog />
    </div>
  );
};

export default Home;
