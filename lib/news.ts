/** In-app "What's new": one line per new feature, newest first. Bump the id for each new entry. */
export const NEWS = [
  { id: 3, title: "Invite friends, get extra scans", body: "Share your link: you both get 3 extra scans when a friend signs up, and you get 10 more if they subscribe.", href: "/account#invite" },
  { id: 2, title: "Share your leak report", body: "Share a clean image of your total, with no merchant names, no bank and no account numbers.", href: "/upload" },
  { id: 1, title: "Monthly check-up", body: "Scan each new statement: Budgeto shows new subscriptions, price hikes and fees that came back.", href: "/upload" },
] as const;
