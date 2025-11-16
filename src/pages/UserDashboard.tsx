import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, Vote, Users, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from "@/contexts/AppContext";
import { VotingSection } from "@/components/VotingSection";
import { UserResults } from "@/components/UserResults";
import ThemeToggle from "@/components/ThemeToggle";

export default function UserDashboard() {
  const { userSession, logoutUser } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userSession) {
      navigate("/");
    }
  }, [userSession, navigate]);

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  if (!userSession) return null;

  return (
    <div className="min-h-screen bg-background">
      <Tabs defaultValue="vote" className="w-full">
        <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Vote className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-card-foreground">
                  Panel de Votación
                </h1>
                <p className="text-sm text-muted-foreground">
                  DNI: {userSession.dni}
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
          <TabsContent value="vote">
            {/* Secondary tabs: Presidentes / Alcaldes / Resultados (pill style) */}
            <Tabs defaultValue="presidentes" className="w-full mb-8">
              <TabsList className="w-full max-w-6xl mx-auto grid grid-cols-3 gap-10 mb-16 pb-2 bg-transparent shadow-none border-none">
                <TabsTrigger
                  value="presidentes"
                  className="border border-border bg-transparent rounded-lg p-4 text-left flex items-start gap-6 data-[state=active]:border-primary data-[state=active]:ring-1 data-[state=active]:ring-primary data-[state=active]:shadow-md"
                >
                  <div className="pt-1">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold">Presidentes</div>
                    <div className="text-sm text-muted-foreground">
                      Gestión de candidatos presidenciales
                    </div>
                  </div>
                </TabsTrigger>

                <TabsTrigger
                  value="alcaldes"
                  className="border border-border bg-transparent rounded-lg p-4 text-left flex items-start gap-6 data-[state=active]:border-primary data-[state=active]:ring-1 data-[state=active]:ring-primary data-[state=active]:shadow-md"
                >
                  <div className="pt-1">
                    <Users className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold">Alcaldes</div>
                    <div className="text-sm text-muted-foreground">
                      Gestión de candidatos a la alcaldía
                    </div>
                  </div>
                </TabsTrigger>

                <TabsTrigger
                  value="results"
                  className="border border-border bg-transparent rounded-lg p-4 text-left flex items-start gap-6 data-[state=active]:border-primary data-[state=active]:ring-1 data-[state=active]:ring-primary data-[state=active]:shadow-md"
                >
                  <div className="pt-1">
                    <BarChart3 className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold">Resultados</div>
                    <div className="text-sm text-muted-foreground">
                      Análisis y gráficas generales
                    </div>
                  </div>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="presidentes">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <VotingSection onlyCategory="presidencia" />
                </motion.div>
              </TabsContent>

              <TabsContent value="alcaldes">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <VotingSection onlyCategory="alcaldia" />
                </motion.div>
              </TabsContent>

              <TabsContent value="results">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <UserResults />
                </motion.div>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </main>
      </Tabs>
    </div>
  );
}
