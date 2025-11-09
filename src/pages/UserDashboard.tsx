import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, Vote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApp } from '@/contexts/AppContext';
import { VotingSection } from '@/components/VotingSection';
import { UserResults } from '@/components/UserResults';

export default function UserDashboard() {
  const { userSession, logoutUser } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userSession) {
      navigate('/');
    }
  }, [userSession, navigate]);

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  if (!userSession) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Vote className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-card-foreground">Panel de Votación</h1>
              <p className="text-sm text-muted-foreground">DNI: {userSession.dni}</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Salir
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="vote" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="vote">Postulaciones</TabsTrigger>
            <TabsTrigger value="results">Resultados</TabsTrigger>
          </TabsList>

          <TabsContent value="vote">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <VotingSection />
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
      </main>
    </div>
  );
}
