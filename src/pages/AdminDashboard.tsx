import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, Vote, Users, BarChart3, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useApp } from "@/contexts/AppContext";
import { CandidateManagement } from "@/components/CandidateManagement";
import { AdminResults } from "@/components/AdminResults";
import { DataAnalysis } from "@/components/DataAnalysis";
import ThemeToggle from "@/components/ThemeToggle";
import { useState } from "react";

export default function AdminDashboard() {
  const { adminSession, logoutAdmin } = useApp();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<
    "presidentes" | "alcaldes" | "resultados" | "analisis"
  >("presidentes");

  useEffect(() => {
    if (!adminSession) {
      navigate("/");
    }
  }, [adminSession, navigate]);

  const handleLogout = () => {
    logoutAdmin();
    navigate("/");
  };

  if (!adminSession) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Vote className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-card-foreground">
                Panel de Administración
              </h1>
              <p className="text-sm text-muted-foreground">
                {adminSession.name}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card
            className={`cursor-pointer transition-all hover:shadow-lg ${
              activeSection === "presidentes" ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setActiveSection("presidentes")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Presidentes
              </CardTitle>
              <CardDescription>
                Gestión de candidatos presidenciales
              </CardDescription>
            </CardHeader>
          </Card>

          <Card
            className={`cursor-pointer transition-all hover:shadow-lg ${
              activeSection === "alcaldes" ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setActiveSection("alcaldes")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-accent" />
                Alcaldes
              </CardTitle>
              <CardDescription>
                Gestión de candidatos a alcaldía
              </CardDescription>
            </CardHeader>
          </Card>

          <Card
            className={`cursor-pointer transition-all hover:shadow-lg ${
              activeSection === "resultados" ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setActiveSection("resultados")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-success" />
                Resultados
              </CardTitle>
              <CardDescription>Análisis y gráficas generales</CardDescription>
            </CardHeader>
          </Card>

          <Card
            className={`cursor-pointer transition-all hover:shadow-lg ${
              activeSection === "analisis" ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setActiveSection("analisis")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-warning" />
                Análisis de Datos
              </CardTitle>
              <CardDescription>Carga CSV y modelado</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeSection === "presidentes" && (
            <CandidateManagement category="presidencia" />
          )}
          {activeSection === "alcaldes" && (
            <CandidateManagement category="alcaldia" />
          )}
          {activeSection === "resultados" && <AdminResults />}
          {activeSection === "analisis" && <DataAnalysis />}
        </motion.div>
      </main>
    </div>
  );
}
