import { RefObject } from "react";
export const useDropdownPosition = (
  ref: RefObject<HTMLDivElement | null> | RefObject<HTMLDivElement>
) => {
  const getDrowdownPosition = () => {
    if (!ref.current) return { top: 0, left: 0 };
    const rect = ref.current.getBoundingClientRect(); // get the bounding rectangle of the dropdown, the bounding rectangle is the smallest rectangle that can contain the dropdown
    const dropdownWidth = 240; // width of the dropdown ( w-60 )

    //calculate the intial postion of the dropdown
    let left = rect.left + window.scrollX; // winow.scrollX is the horizontal scroll position of the document
    const gap = 12; // gap between button and menu (matches triangle position)
    const top = rect.bottom + window.scrollY; // window.scrollY is the vertical scroll position of the document

    //check if the dropdown would go off the right edge of the viewport
    if (left + dropdownWidth > window.innerWidth) {
      // Align to the right edge of the viewport
      left = rect.right + window.scrollX - dropdownWidth;
      // if still off the screen, align to the right edge with some padding
      if (left < 0) left = window.innerWidth - dropdownWidth - 16;
    }
    // Ensure drodown doesn't go off left edge
    if (left < 0) {
      left = 16;
    }

    return { top, left };
  };
  return { getDrowdownPosition };
};
