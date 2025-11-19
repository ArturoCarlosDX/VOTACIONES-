import React, { useState } from "react";
import {
  Home,
  Users,
  BarChart3,
  MapPin,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";

interface SideMenuProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

export default function SideMenu({
  activeTab,
  onTabChange,
  onLogout,
}: SideMenuProps) {
  const { userSession } = useApp();
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  const menuItems = [
    {
      id: "inicio",
      label: "Inicio",
      description: "Director del panel",
      icon: Home,
    },
    {
      id: "presidentes",
      label: "Presidentes",
      description: "Gestión de candidatos presidenciales",
      icon: Users,
    },
    {
      id: "alcaldes",
      label: "Alcaldes",
      description: "Gestión de candidatos a la alcaldía",
      icon: MapPin,
    },
    {
      id: "results",
      label: "Resultados",
      description: "Análisis y gráficas generales",
      icon: BarChart3,
    },
  ];

  return (
    <div className="hidden md:flex md:fixed md:left-0 md:top-0 md:bottom-0 md:w-64 md:flex-col md:bg-card md:border-r md:border-border md:z-40">
      {/* Header con perfil */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
            <span className="text-xl font-bold text-primary">V</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-card-foreground truncate">
              Votante
            </p>
            <p className="text-xs text-muted-foreground">
              DNI: {userSession?.dni}
            </p>
          </div>
        </div>
        <div className="inline-block px-2 py-1 bg-success/20 rounded text-xs text-success font-medium">
          ● Online
        </div>
      </div>

      {/* Separador */}
      <div className="h-px bg-border" />

      {/* Menú principal */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">
          Navegación
        </div>

        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-4 rounded-lg transition-all text-left ${
                  isActive
                    ? "bg-primary/10 text-primary border-2 border-primary"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <Icon className="w-6 h-6 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-card-foreground">
                    {item.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer con logout */}
      <div className="border-t border-border p-4">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-colors text-left"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Salir</span>
        </button>
      </div>
    </div>
  );
}
