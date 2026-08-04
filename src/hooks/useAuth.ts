import { useState } from "react";

export function useAuth() {
  const [isLoggedIn] = useState(false);

  return { isLoggedIn };
}