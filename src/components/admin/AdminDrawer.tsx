"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type AdminDrawerProps = {
  open: boolean;
  onClose: () => void;
};

const navItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Total Order", href: "/admin/orders" },
  { label: "Review", href: "/admin/reviews" },
  { label: "Enter Google Tag Manager ID", href: "/admin/tracking" },
];

export default function AdminDrawer({ open, onClose }: AdminDrawerProps) {
  const pathname = usePathname();

  if (!open) return null;

  return (
    <div className="admin-drawer" onClick={onClose}>
      <div className="admin-drawer__panel" onClick={(event) => event.stopPropagation()}>
        <div className="admin-drawer__header">
          <h3>Admin Menu</h3>
          <button type="button" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <nav className="admin-drawer__nav">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={active ? "admin-drawer__link active" : "admin-drawer__link"}
                onClick={onClose}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
