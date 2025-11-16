import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { useApp } from "@/contexts/AppContext";
import { toast } from "sonner";
import { Candidate } from "@/data/mockData";

interface CandidateManagementProps {
  category: "presidencia" | "alcaldia";
}

export function CandidateManagement({ category }: CandidateManagementProps) {
  const { candidates, addCandidate, updateCandidate, deleteCandidate } =
    useApp();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(
    null
  );
  const [deletingCandidateId, setDeletingCandidateId] = useState<string | null>(
    null
  );

  const [formData, setFormData] = useState({
    name: "",
    party: "",
    description: "",
    image: "",
  });

  const categoryCandidates = candidates.filter((c) => c.category === category);
  const sortedCandidates = [...categoryCandidates].sort(
    (a, b) => (b.votes ?? 0) - (a.votes ?? 0)
  );

  const handleOpenDialog = (candidate?: Candidate) => {
    if (candidate) {
      setEditingCandidate(candidate);
      setFormData({
        name: candidate.name,
        party: candidate.party,
        description: candidate.description,
        image: candidate.image,
      });
    } else {
      setEditingCandidate(null);
      setFormData({ name: "", party: "", description: "", image: "" });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingCandidate(null);
    setFormData({ name: "", party: "", description: "", image: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingCandidate) {
      updateCandidate(editingCandidate.id, formData);
      toast.success("Candidato actualizado exitosamente");
    } else {
      addCandidate({ ...formData, category });
      toast.success("Candidato agregado exitosamente");
    }

    handleCloseDialog();
  };

  const handleDeleteClick = (id: string) => {
    setDeletingCandidateId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingCandidateId) {
      deleteCandidate(deletingCandidateId);
      toast.success("Candidato eliminado exitosamente");
      setDeleteDialogOpen(false);
      setDeletingCandidateId(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          Gestión de {category === "presidencia" ? "Presidentes" : "Alcaldes"}
        </h2>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          Agregar Candidato
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {sortedCandidates.map((candidate) => (
          <motion.div
            key={candidate.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="h-full"
          >
            <Card className="h-full bg-transparent border border-border shadow-none">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <img
                    src={candidate.image}
                    alt={candidate.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-1">
                      {candidate.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {candidate.party}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {candidate.description}
                </p>
                <p className="text-sm font-medium mb-4">
                  Votos: {candidate.votes}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleOpenDialog(candidate)}
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleDeleteClick(candidate.id)}
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Eliminar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingCandidate ? "Editar Candidato" : "Agregar Candidato"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Nombre completo
              </label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Ej: María Fernández"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Partido</label>
              <Input
                value={formData.party}
                onChange={(e) =>
                  setFormData({ ...formData, party: e.target.value })
                }
                placeholder="Ej: Partido Progreso Nacional"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Descripción
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Breve descripción del candidato y sus propuestas"
                rows={4}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                URL de imagen
              </label>
              <Input
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                placeholder="https://ejemplo.com/imagen.jpg"
                required
                type="url"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {editingCandidate ? "Actualizar" : "Agregar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El candidato será eliminado
              permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
