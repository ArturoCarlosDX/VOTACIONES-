import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { useApp } from '@/contexts/AppContext';
import { toast } from 'sonner';

export function VotingSection() {
  const { candidates, userSession, voteForCandidate } = useApp();
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const presidenciaCandidates = candidates.filter(c => c.category === 'presidencia');
  const alcaldiaCandidates = candidates.filter(c => c.category === 'alcaldia');

  const handleVoteClick = (candidateId: string) => {
    setSelectedCandidate(candidateId);
    setConfirmDialogOpen(true);
  };

  const handleConfirmVote = () => {
    if (selectedCandidate) {
      voteForCandidate(selectedCandidate);
      const candidate = candidates.find(c => c.id === selectedCandidate);
      toast.success(`¡Voto registrado exitosamente por ${candidate?.name}!`);
      setConfirmDialogOpen(false);
      setSelectedCandidate(null);
    }
  };

  const CandidateCard = ({ candidate }: { candidate: typeof candidates[0] }) => {
    const hasVoted = candidate.category === 'presidencia' 
      ? userSession?.votedPresidencia 
      : userSession?.votedAlcaldia;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: hasVoted ? 1 : 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <Card className={hasVoted ? 'opacity-60' : ''}>
          <CardHeader>
            <div className="flex items-start gap-4">
              <img
                src={candidate.image}
                alt={candidate.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-border"
              />
              <div className="flex-1">
                <CardTitle className="text-xl mb-1">{candidate.name}</CardTitle>
                <CardDescription className="font-medium">{candidate.party}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{candidate.description}</p>
            <Button
              className="w-full"
              disabled={hasVoted}
              onClick={() => handleVoteClick(candidate.id)}
            >
              {hasVoted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Ya votaste
                </>
              ) : (
                'Votar'
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-12">
      {/* Presidencia */}
      <section>
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-foreground mb-2">Elección Presidencial</h2>
          <p className="text-muted-foreground">
            {userSession?.votedPresidencia 
              ? '✓ Ya has votado en esta categoría' 
              : 'Selecciona tu candidato para presidente'}
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {presidenciaCandidates.map(candidate => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </div>
      </section>

      {/* Alcaldía */}
      <section>
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-foreground mb-2">Elección de Alcalde</h2>
          <p className="text-muted-foreground">
            {userSession?.votedAlcaldia 
              ? '✓ Ya has votado en esta categoría' 
              : 'Selecciona tu candidato para alcalde'}
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {alcaldiaCandidates.map(candidate => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </div>
      </section>

      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar voto</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que quieres votar por {candidates.find(c => c.id === selectedCandidate)?.name}? 
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmVote}>
              Confirmar voto
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
