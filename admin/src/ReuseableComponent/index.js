import axios from "axios";

export function CheckImage(path) {
    axios
      .get(path)
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }