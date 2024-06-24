import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTrigger,
} from "../ui/dialog";

import { AutoComplete } from "./AutoComplete";
import { BiSearchAlt2 } from "react-icons/bi";

const SearchDialog = () => {
  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <BiSearchAlt2 size={30} />
        </DialogTrigger>
        <DialogContent>
          <DialogDescription>
            <AutoComplete />
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SearchDialog;
