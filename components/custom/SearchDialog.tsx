import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "components/ui/dialog";

import { AutoComplete } from "components/custom/AutoComplete";
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
