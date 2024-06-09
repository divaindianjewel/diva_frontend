import { FaUser } from "react-icons/fa";
import Login from "@/components/custom/Login";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";

const LoginDialog: React.FC<{ size?: number }> = ({ size = 20 }) => {
  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <FaUser size={size} />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <Login />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LoginDialog;
