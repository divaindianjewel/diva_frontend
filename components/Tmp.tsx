// components/DropdownFilter.js
import { useState } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Checkbox,
} from "@shadcn/ui";

const DropdownFilter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const options = [
    { label: "Silver", count: 16 },
    { label: "Gold", count: 8 },
    { label: "Yellow Gold", count: 5 },
    { label: "Oxidised Silver", count: 1 },
    { label: "Rose Gold", count: 25 },
  ];

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleCheckboxChange = (option) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  return (
    <Dropdown isOpen={isOpen} toggle={toggleDropdown}>
      <DropdownToggle caret>Color</DropdownToggle>
      <DropdownMenu>
        {options.map((option) => (
          <DropdownItem key={option.label}>
            <Checkbox
              checked={selectedOptions.includes(option.label)}
              onChange={() => handleCheckboxChange(option.label)}
            />
            {option.label} <span>({option.count})</span>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default DropdownFilter;
