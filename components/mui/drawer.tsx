"use client";

import React, { useEffect, useState } from "react";
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
import { IoMenu } from "react-icons/io5";
import { BsFillBoxSeamFill } from "react-icons/bs";

interface NavItem {
  href: string;
  label: string;
  icon: any;
}

interface fetchNavItems {
  id: number;
  attributes: {
    name: string;
  };
}

export default function TemporaryDrawer() {
  const [open, setOpen] = useState(false);
  const [loadedItems, setLoadedItems] = useState(false);
  const [navItems, setNavItems] = useState<fetchNavItems[]>([]);

  const TmpnavItems: NavItem[] = [
    { href: "/", label: "GOLD JEWELLERY", icon: "" },
    { href: "/", label: "SILVER JEWELLERY", icon: "" },
    { href: "/", label: "1 GRAM JEWELLERY", icon: "" },
    { href: "/", label: "FUSION JEWELLERY", icon: "" },
    { href: "/orders", label: "My Orders", icon: <BsFillBoxSeamFill /> },
  ];

  useEffect(() => {
    const getItems = async () => {
      const response = await fetch(
        `https://diva-backend-iukkr.ondigitalocean.app/api/main-categories`
      );
      const data = await response.json();
      setNavItems(data.data);
      setLoadedItems(true);
    };
    getItems();
  }, [loadedItems]);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {navItems.map((item, index) => (
          <ListItem key={index}>
            <Link href={`/main_category/${item.id}`}>
              <ListItemButton>
                <ListItemText primary={item.attributes.name} />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem>
          <Link href={`orders`}>
            <ListItemText>
              <div className="flex items-center justify-center gap-3">
                <BsFillBoxSeamFill /> My orders
              </div>
            </ListItemText>
          </Link>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <div>
      <Button onClick={toggleDrawer(true)}>
        <IoMenu color={"white"} size={30} />{" "}
      </Button>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}
