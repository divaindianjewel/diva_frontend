"use client";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Link from "next/link";
// react icons

// Icons
import { MdHome } from "react-icons/md";
import { FaStickyNote } from "react-icons/fa";
import { IoIosSchool } from "react-icons/io";
import { IoMenu } from "react-icons/io5";
import { FaFileAlt } from "react-icons/fa";
import { FaLaptopCode } from "react-icons/fa";

interface NavItem {
  href: string;
  label: string;
  icon: any;
}

export default function TemporaryDrawer() {
  const [open, setOpen] = useState(false);

  const navItems: NavItem[] = [
    { href: "/", label: "Home", icon: <MdHome /> },
    { href: "/blog", label: "blog", icon: <FaStickyNote /> },
    { href: "/college", label: "Student", icon: <IoIosSchool /> },
    { href: "/resume", label: "Resume", icon: <FaFileAlt /> },
    { href: "/skills", label: "Needed Skills", icon: <FaLaptopCode /> },
  ];
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {navItems.map((items, index) => (
          <ListItem key={index}>
            <Link href={items.href}>
              <ListItemButton>
                <ListItemIcon>{items.icon}</ListItemIcon>
                <ListItemText primary={items.label} />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>

      <Divider />
    </Box>
  );

  return (
    <div>
      <Button onClick={toggleDrawer(true)}>
        <IoMenu color={"black"} size={30} />{" "}
      </Button>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}
