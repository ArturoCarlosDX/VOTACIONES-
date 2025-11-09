import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { useApp } from '@/contexts/AppContext';
import { toast } from 'sonner';

interface DniModalProps {
  open: boolean;
  onClose: () => void;
}

export function DniModal({ open, onClose }: DniModalProps) {
  const [dni, setDni] = useState('');
  const { loginUser } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (dni.length < 7 || dni.length > 10) {
      toast.error('El DNI debe tener entre 7 y 10 dígitos');
      return;
    }

    loginUser(dni);
    toast.success('¡Bienvenido al sistema de votación!');
    navigate('/user');
    onClose();
    setDni('');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">Ingresa tu DNI</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div>
            <label htmlFor="dni" className="block text-sm font-medium mb-2">
              Número de DNI
            </label>
            <Input
              id="dni"
              type="number"
              placeholder="12345678"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              className="text-lg"
              required
              min="1000000"
              max="99999999999"
            />
            <p className="text-sm text-muted-foreground mt-2">
              Ingresa tu documento de identidad para acceder
            </p>
          </div>
          <Button type="submit" className="w-full" size="lg">
            Continuar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
