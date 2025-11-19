import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LogOut,
  Vote,
  Users,
  BarChart3,
  Info,
  FileText,
  Download,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import SideMenu from "@/components/SideMenu";
import { useApp } from "@/contexts/AppContext";
import { VotingSection } from "@/components/VotingSection";
import { UserResults } from "@/components/UserResults";
import ThemeToggle from "@/components/ThemeToggle";

export default function UserDashboard() {
  const { userSession, logoutUser } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("inicio");
  const [showVotingWarning, setShowVotingWarning] = useState(false);
  const [missingVotes, setMissingVotes] = useState<string[]>([]);
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    if (!userSession) {
      navigate("/");
    }
  }, [userSession, navigate]);

  // Actualizar el modal cuando el usuario vota
  useEffect(() => {
    if (userSession) {
      const missing = [];
      if (!userSession.votedPresidencia) missing.push("Presidente");
      if (!userSession.votedAlcaldia) missing.push("Alcalde");
      setMissingVotes(missing);
    }
  }, [userSession]);

  // Redirigir a resultados cuando completa ambas votaciones (solo una vez)
  useEffect(() => {
    if (
      !hasRedirected &&
      userSession?.votedPresidencia &&
      userSession?.votedAlcaldia &&
      activeTab !== "results" &&
      (activeTab === "presidentes" || activeTab === "alcaldes")
    ) {
      // Solo redirigir si estaba en una pestaña de votación y aún no se ha redirigido
      setTimeout(() => {
        setActiveTab("results");
        setHasRedirected(true); // Marcar que ya se hizo la redirección
      }, 1000); // Pequeño delay para que vea el toast de confirmación
    }
  }, [
    userSession?.votedPresidencia,
    userSession?.votedAlcaldia,
    activeTab,
    hasRedirected,
  ]);

  const handleLogoutAttempt = () => {
    // Verificar si el usuario ha votado en ambas categorías
    if (!userSession?.votedPresidencia || !userSession?.votedAlcaldia) {
      // Determinar qué le falta votar
      const missing = [];
      if (!userSession?.votedPresidencia) missing.push("Presidente");
      if (!userSession?.votedAlcaldia) missing.push("Alcalde");

      setMissingVotes(missing);
      setShowVotingWarning(true);
    } else {
      // Si ya votó en ambas, proceder con el logout
      handleLogout();
    }
  };

  const handleContinueVoting = () => {
    setShowVotingWarning(false);
    // Redirigir al primer apartado que le falta votar
    if (!userSession?.votedPresidencia) {
      setActiveTab("presidentes");
    } else if (!userSession?.votedAlcaldia) {
      setActiveTab("alcaldes");
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  if (!userSession) return null;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Modal de advertencia de votación */}
      <AlertDialog open={showVotingWarning} onOpenChange={setShowVotingWarning}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-6 h-6 text-yellow-500" />
              <AlertDialogTitle>No ha completado su votación</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="space-y-3">
              <p>
                Para poder salir, debe completar su votación en los siguientes
                apartados:
              </p>
              <ul className="list-disc list-inside space-y-1 font-semibold text-card-foreground">
                {missingVotes.map((vote) => (
                  <li key={vote}>{vote}</li>
                ))}
              </ul>
              <p className="text-sm pt-2">
                Después de completar su votación en ambas categorías, será
                redirigido automáticamente a la sección de Resultados. Solo
                podrá cerrar sesión desde allí.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleContinueVoting}
              className="bg-primary hover:bg-primary/90"
            >
              Terminar con la votación
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Sidebar */}
      <SideMenu
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogoutAttempt}
      />

      {/* Contenido principal */}
      <div className="flex-1 md:ml-64 flex flex-col">
        <header className="bg-card border-b border-border sticky top-0 z-40 shadow-sm">
          <div className="px-4 md:px-8 py-4 flex items-center justify-between">
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
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-8">
          <Tabs value={activeTab} className="w-full">
            {/* Pestaña Inicio */}
            <TabsContent value="inicio" className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto"
              >
                <div className="mb-12">
                  <h2 className="text-3xl font-bold mb-2">
                    ¿Qué elegiremos en estas Elecciones Generales 2026?
                  </h2>
                  <p className="text-muted-foreground mb-8">
                    Estas son las autoridades por las cuales votaremos en las
                    próximas Elecciones Generales 2026.
                  </p>

                  {/* Tarjetas de candidatos */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-12">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="flex flex-col items-center gap-2 p-4"
                    >
                      <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                        1
                      </div>
                      <p className="text-sm font-semibold text-center">
                        Presidente
                      </p>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="flex flex-col items-center gap-2 p-4"
                    >
                      <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                        2
                      </div>
                      <p className="text-sm font-semibold text-center">
                        Vicepresidentes
                      </p>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="flex flex-col items-center gap-2 p-4"
                    >
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                        60
                      </div>
                      <p className="text-sm font-semibold text-center">
                        Senadores
                      </p>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="flex flex-col items-center gap-2 p-4"
                    >
                      <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                        130
                      </div>
                      <p className="text-sm font-semibold text-center">
                        Diputados
                      </p>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="flex flex-col items-center gap-2 p-4"
                    >
                      <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                        5
                      </div>
                      <p className="text-sm font-semibold text-center">
                        Parlamento Andino
                      </p>
                    </motion.div>
                  </div>

                  {/* Barra indicadora */}
                  <div className="h-2 bg-gradient-to-r from-gray-400 to-blue-500 rounded-full mb-12" />

                  {/* Secciones de información */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-card border-l-4 border-primary p-6 rounded-lg"
                    >
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                        Acerca de
                      </p>
                      <h3 className="text-2xl font-bold text-primary mb-4">
                        Conoce más sobre el proceso electoral 2026
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Estar informados es fundamental para una democracia
                        saludable. ¿Quieres conocer más sobre este importante
                        proceso electoral?
                      </p>
                      <button className="text-primary font-semibold hover:underline">
                        Saber más →
                      </button>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-card border border-border p-6 rounded-lg"
                    >
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                        Lo que debes saber
                      </p>
                      <p className="text-muted-foreground mb-4">
                        Algunos puntos importantes sobre estas elecciones 2026
                      </p>
                      <ul className="space-y-3 text-sm">
                        <li className="text-muted-foreground">
                          <strong>Fecha:</strong> Domingo 12 de abril de 2026 de
                          7 a.m. a 5 p.m.
                        </li>
                        <li className="text-muted-foreground">
                          <strong>Votantes:</strong> Más de 27 millones de
                          peruanos eligirán quiénes tomarán los siguientes
                          cargos:
                        </li>
                        <li className="text-muted-foreground">
                          Presidente, vicepresidentes, senadores, diputados y
                          titulares del parlamento andino.
                        </li>
                      </ul>
                    </motion.div>
                  </div>

                  {/* Revisa nuestro material informativo */}
                  <div className="mt-16">
                    <h3 className="text-2xl font-bold mb-2">
                      Revisa nuestro material informativo
                    </h3>
                    <p className="text-muted-foreground mb-8">
                      Conoce más sobre las EG 2026
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                      {/* Left side - Lista de opciones */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-4"
                      >
                        <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                          <div className="flex items-start gap-3">
                            <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-card-foreground">
                                Datos claves
                              </p>
                            </div>
                            <Info className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          </div>
                        </div>

                        <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                          <div className="flex items-start gap-3">
                            <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-card-foreground">
                                Principales cambios normativos
                              </p>
                            </div>
                            <Info className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          </div>
                        </div>

                        <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                          <div className="flex items-start gap-3">
                            <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-card-foreground">
                                Requisitos para el Voto Digital
                              </p>
                            </div>
                            <Info className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          </div>
                        </div>

                        <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                          <div className="flex items-start gap-3">
                            <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-card-foreground">
                                Guía del votante
                              </p>
                            </div>
                            <Info className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          </div>
                        </div>

                        <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                          <div className="flex items-start gap-3">
                            <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-card-foreground">
                                Preguntas frecuentes
                              </p>
                            </div>
                            <Info className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          </div>
                        </div>
                      </motion.div>

                      {/* Right side - Video y descripción */}
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="md:col-span-2"
                      >
                        <h4 className="text-xl font-bold mb-4">
                          Datos claves sobre las Elecciones Generales 2026
                        </h4>

                        {/* Video placeholder */}
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden mb-4 aspect-video flex items-center justify-center relative group">
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-all">
                            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center cursor-pointer group-hover:scale-110 transition-transform">
                              <div className="w-0 h-0 border-l-8 border-l-white border-t-5 border-t-transparent border-b-5 border-b-transparent ml-1" />
                            </div>
                          </div>
                          <p className="text-white text-center text-sm absolute top-4 left-4 right-4">
                            Datos claves sobre las Elecciones Generales 2026
                          </p>
                        </div>

                        <div className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold">
                          <span>▶</span>
                          <span>Ver en línea</span>
                        </div>
                      </motion.div>
                    </div>

                    {/* Materiales descargables */}
                    <div className="mt-12">
                      <h4 className="text-xl font-bold mb-6">
                        Materiales descargables
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <motion.a
                          whileHover={{ y: -5 }}
                          href="#"
                          className="bg-card border border-border rounded-lg p-6 text-center hover:shadow-lg transition-all cursor-pointer group"
                        >
                          <div className="flex justify-center mb-4">
                            <Download className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                          </div>
                          <p className="font-semibold text-card-foreground mb-2">
                            Presidenciales
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Conoce más sobre el proceso electoral
                          </p>
                        </motion.a>

                        <motion.a
                          whileHover={{ y: -5 }}
                          href="#"
                          className="bg-card border border-border rounded-lg p-6 text-center hover:shadow-lg transition-all cursor-pointer group"
                        >
                          <div className="flex justify-center mb-4">
                            <Download className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                          </div>
                          <p className="font-semibold text-card-foreground mb-2">
                            Congresales
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Conoce más sobre el proceso electoral
                          </p>
                        </motion.a>

                        <motion.a
                          whileHover={{ y: -5 }}
                          href="#"
                          className="bg-card border border-border rounded-lg p-6 text-center hover:shadow-lg transition-all cursor-pointer group"
                        >
                          <div className="flex justify-center mb-4">
                            <Download className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                          </div>
                          <p className="font-semibold text-card-foreground mb-2">
                            Parlamento Andino
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Conoce más sobre el proceso electoral
                          </p>
                        </motion.a>

                        <motion.a
                          whileHover={{ y: -5 }}
                          href="#"
                          className="bg-card border border-border rounded-lg p-6 text-center hover:shadow-lg transition-all cursor-pointer group"
                        >
                          <div className="flex justify-center mb-4">
                            <Download className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                          </div>
                          <p className="font-semibold text-card-foreground mb-2">
                            Voto digital
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Conoce todo acerca del voto digital
                          </p>
                        </motion.a>
                      </div>
                    </div>

                    {/* Banner informativo */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 text-white relative overflow-hidden"
                    >
                      <div className="absolute right-0 top-0 opacity-10 text-9xl font-bold">
                        ✓
                      </div>
                      <div className="relative z-10">
                        <h4 className="text-2xl font-bold mb-4">
                          Tu derecho es estar informado de primera mano.
                        </h4>
                        <p className="text-blue-100 mb-6 max-w-xl">
                          Accede a toda la información sobre las Elecciones
                          Generales 2026
                        </p>
                        <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all hover:scale-105">
                          Más información aquí
                        </button>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            {/* Pestaña Presidentes */}
            <TabsContent value="presidentes" className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <VotingSection onlyCategory="presidencia" />
              </motion.div>
            </TabsContent>

            {/* Pestaña Alcaldes */}
            <TabsContent value="alcaldes" className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <VotingSection onlyCategory="alcaldia" />
              </motion.div>
            </TabsContent>

            {/* Pestaña Resultados */}
            <TabsContent value="results" className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <UserResults />
              </motion.div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
