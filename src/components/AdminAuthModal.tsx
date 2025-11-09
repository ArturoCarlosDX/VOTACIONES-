import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useApp } from '@/contexts/AppContext';
import { toast } from 'sonner';

interface AdminAuthModalProps {
  open: boolean;
  onClose: () => void;
}

export function AdminAuthModal({ open, onClose }: AdminAuthModalProps) {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  
  const { loginAdmin, registerAdmin } = useApp();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loginAdmin(loginEmail, loginPassword)) {
      toast.success('¡Bienvenido al panel de administración!');
      navigate('/admin');
      onClose();
      setLoginEmail('');
      setLoginPassword('');
    } else {
      toast.error('Credenciales incorrectas');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerAdmin(registerName, registerEmail, registerPassword)) {
      toast.success('¡Cuenta creada exitosamente!');
      navigate('/admin');
      onClose();
      setRegisterName('');
      setRegisterEmail('');
      setRegisterPassword('');
    } else {
      toast.error('El correo ya está registrado');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">Panel de Administración</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="login" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Ingresar</TabsTrigger>
            <TabsTrigger value="register">Registrarse</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="login-email" className="block text-sm font-medium mb-2">
                  Correo electrónico
                </label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="admin@demo.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="login-password" className="block text-sm font-medium mb-2">
                  Contraseña
                </label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Demo: admin@demo.com / Demo123!
              </p>
              <Button type="submit" className="w-full">
                Ingresar
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label htmlFor="register-name" className="block text-sm font-medium mb-2">
                  Nombre completo
                </label>
                <Input
                  id="register-name"
                  type="text"
                  placeholder="Juan Pérez"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="register-email" className="block text-sm font-medium mb-2">
                  Correo electrónico
                </label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="register-password" className="block text-sm font-medium mb-2">
                  Contraseña
                </label>
                <Input
                  id="register-password"
                  type="password"
                  placeholder="••••••••"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <Button type="submit" className="w-full">
                Crear cuenta
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
