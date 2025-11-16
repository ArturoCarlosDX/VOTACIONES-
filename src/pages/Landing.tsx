import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Vote, UserCircle, Shield, BarChart3, Database, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DniModal } from "@/components/DniModal";
import { AdminAuthModal } from "@/components/AdminAuthModal";
import ThemeToggle from "@/components/ThemeToggle";
import { Card } from "@/components/ui/card"

export default function Landing() {
  const [dniModalOpen, setDniModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Vote className="w-12 h-12 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                Elecciones 2025
              </h1>
            </div>
            <div>
              {/* Theme toggle */}
              <ThemeToggle />
            </div>
          </div>

          <p className="text-center text-lg text-muted-foreground max-w-2xl mx-auto">
            Sistema de votación electrónica para las elecciones presidenciales y
            municipales. Participa de manera segura y transparente.
          </p>
        </motion.header>

        {/* Hero Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-12 shadow-2xl"
        >
          <img
            src="https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1200&h=400&fit=crop"
            alt="Elecciones"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/60 flex items-center justify-center">
            <div className="text-center text-white px-4">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Únete al cambio
              </h2>
              <p className="text-lg md:text-xl opacity-90">
                CONTIGO MEJORAMOS EL PAIS
              </p>
               <p className="text-lg md:text-xl opacity-90">
                tu opinion si importa!!
              </p>
            </div>
          </div>
        </motion.div>

        {/* Role Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto"
        >
          {/* Usuario */}
          <div className="bg-card rounded-xl p-8 shadow-lg border border-border hover:shadow-xl transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <UserCircle className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-card-foreground">
                Votante
              </h3>
              <p className="text-muted-foreground mb-6">
                Ingresa con tu DNI para ejercer tu derecho al voto y ver los
                resultados en tiempo real.
              </p>
              <Button
                size="lg"
                className="w-full"
                onClick={() => setDniModalOpen(true)}
              >
                Entrar como Usuario
              </Button>
            </div>
          </div>

          {/* Admin */}
          <div className="bg-card rounded-xl p-8 shadow-lg border border-border hover:shadow-xl transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mb-6">
                <Shield className="w-12 h-12 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-card-foreground">
                Administrador
              </h3>
              <p className="text-muted-foreground mb-6">
                Accede al panel de administración para gestionar candidatos y
                analizar resultados.
              </p>
              <Button
                size="lg"
                variant="outline"
                className="w-full"
                onClick={() => setAdminModalOpen(true)}
              >
                Entrar como Administrador
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Features Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h3 className="mb-3 text-3xl font-bold text-foreground">Sistema Seguro y Confiable</h3>
              <p className="text-lg text-muted-foreground">
                Tecnología de vanguardia para garantizar elecciones transparentes
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <CheckCircle2 className="mb-4 h-12 w-12 text-success" />
                <h4 className="mb-2 text-xl font-semibold text-card-foreground">
                  Votación Segura
                </h4>
                <p className="text-muted-foreground">
                  Sistema de autenticación con DNI y encriptación de extremo a extremo
                </p>
              </Card>
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <BarChart3 className="mb-4 h-12 w-12 text-primary" />
                <h4 className="mb-2 text-xl font-semibold text-card-foreground">
                  Resultados en Tiempo Real
                </h4>
                <p className="text-muted-foreground">
                  Visualización instantánea de resultados con gráficos interactivos
                </p>
              </Card>
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <Database className="mb-4 h-12 w-12 text-accent" />
                <h4 className="mb-2 text-xl font-semibold text-card-foreground">
                  Análisis Avanzado
                </h4>
                <p className="text-muted-foreground">
                  Herramientas de análisis de datos y predicciones electorales
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section>
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-8xl">
              <h3 className="mb-6 text-center text-3xl font-bold text-foreground">
                Información Electoral
              </h3>
              <div className="grid gap-2 md:grid-cols-2">
	              <Card className="p-8">
	                <div className="space-y-4">
	                  <div>
	                    <h4 className="mb-2 font-semibold text-lg text-card-foreground">Fecha de Elecciones</h4>
	                    <p className="text-muted-foreground">Domingo 15 de Diciembre, 2024</p>
	                  </div>
	                  <div>
	                    <h4 className="mb-2 font-semibold text-lg text-card-foreground">Cargos a Elegir</h4>
	                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
	                      <li>Presidente de la República</li>
	                      <li>Alcaldes Municipales</li>
	                    </ul>
	                  </div>
	                  <div>
	                    <h4 className="mb-2 font-semibold text-lg text-card-foreground">Requisitos para Votar</h4>
	                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
	                      <li>Ser ciudadano mayor de 18 años</li>
	                      <li>Contar con DNI vigente</li>
	                      <li>Estar registrado en el padrón electoral</li>
	                    </ul>
	                  </div>
	                </div>
	              </Card>
	              <Card className="p-8">
	                <div className="space-y-4">
	                  <div>
	                    <h4 className="mb-2 font-semibold text-lg text-card-foreground">1. Da click en "Ingresar como Votante".</h4>
	                  </div>
										<div>
	                    <h4 className="mb-2 font-semibold text-lg text-card-foreground">2. Se abre una ventana donde ingresa su DNI.</h4>
										</div>
										<div>
	                    <h4 className="mb-2 font-semibold text-lg text-card-foreground">3. El sistema valida el DNI y lo lleva al Panel de Votación.</h4>
										</div>
	                  <div>
	                    <h4 className="mb-2 font-semibold text-lg text-card-foreground">4. El usuario elige la categoría donde quiere votar.</h4>
	                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
	                      <li>Presidencia</li>
	                      <li>Alcaldía</li>
	                    </ul>
	                  </div>
										<div>
											<h4 className="mb-2 font-semibold text-lg text-card-foreground">5. En cada categoría ve la lista de candidatos con su foto, nombre y botón de "Votar".</h4>
										</div>
										<div>
           						<h4 className="mb-2 font-semibold text-lg text-card-foreground">6. El usuario selecciona un candidato y confirma su voto en una ventana emergente.</h4>
										</div>
										<div>
            					<h4 className="mb-2 font-semibold text-lg text-card-foreground">7. El sistema registra el voto y marca la categoría como “Voto realizado”.</h4>
										</div>
	                  <div>
                			<h4 className="mb-2 font-semibold text-lg text-card-foreground">8. El usuario puede ir a “Mis Resultados” para ver:</h4>
	                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
	                      <li>A quién votó</li>
	                    </ul>
	                  </div>
										<div>
											<h4 className="mb-2 font-semibold text-lg text-card-foreground">9. Finalmente, puede cerrar sesión o regresar al menú principal.</h4>
										</div>
	                </div>
	              </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Info Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12 text-sm text-muted-foreground"
        >
          <p>YART • Sistema de Votación Electrónica</p>
          <p className="mt-2">
            El futuro esta en la nueva generacion de dibujitos
          </p>
        </motion.footer>
      </div>

      <DniModal open={dniModalOpen} onClose={() => setDniModalOpen(false)} />
      <AdminAuthModal
        open={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
      />
    </div>
  );
}
