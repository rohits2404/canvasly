import { useEvent } from "react-use";

export const useWindowEvents = () => {
    useEvent("beforeunload", (event) => {
        event.preventDefault();
        event.returnValue = "Are You Sure You Want To Leave?";
    });
};
