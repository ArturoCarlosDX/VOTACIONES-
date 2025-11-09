import { motion } from 'framer-motion';
import { CheckCircle2, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useApp } from '@/contexts/AppContext';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export function UserResults() {
  const { candidates, getUserVotes } = useApp();
  const userVotes = getUserVotes();

  const presidenciaCandidates = candidates.filter(c => c.category === 'presidencia');
  const alcaldiaCandidates = candidates.filter(c => c.category === 'alcaldia');

  const votedPresidente = presidenciaCandidates.find(c => c.id === userVotes.presidencia);
  const votedAlcalde = alcaldiaCandidates.find(c => c.id === userVotes.alcaldia);

  const totalPresidenciaVotes = presidenciaCandidates.reduce((sum, c) => sum + c.votes, 0);
  const totalAlcaldiaVotes = alcaldiaCandidates.reduce((sum, c) => sum + c.votes, 0);

  const presidenciaData = presidenciaCandidates.map(c => ({
    name: c.name,
    votos: c.votes,
    percentage: totalPresidenciaVotes > 0 ? ((c.votes / totalPresidenciaVotes) * 100).toFixed(1) : 0
  }));

  const alcaldiaData = alcaldiaCandidates.map(c => ({
    name: c.name,
    votos: c.votes,
    percentage: totalAlcaldiaVotes > 0 ? ((c.votes / totalAlcaldiaVotes) * 100).toFixed(1) : 0
  }));

  return (
    <div className="space-y-8">
      {/* User Votes */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-foreground">Tus Votos</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                Presidente
              </CardTitle>
            </CardHeader>
            <CardContent>
              {votedPresidente ? (
                <div className="flex items-center gap-4">
                  <img
                    src={votedPresidente.image}
                    alt={votedPresidente.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-lg">{votedPresidente.name}</p>
                    <p className="text-sm text-muted-foreground">{votedPresidente.party}</p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No has votado aún</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                Alcalde
              </CardTitle>
            </CardHeader>
            <CardContent>
              {votedAlcalde ? (
                <div className="flex items-center gap-4">
                  <img
                    src={votedAlcalde.image}
                    alt={votedAlcalde.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-lg">{votedAlcalde.name}</p>
                    <p className="text-sm text-muted-foreground">{votedAlcalde.party}</p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No has votado aún</p>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Results Charts */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-foreground">Resultados Generales</h2>
        
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Elección Presidencial</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={presidenciaData}
                    dataKey="votos"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                  >
                    {presidenciaData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Total de votos: {totalPresidenciaVotes}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Elección de Alcalde</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={alcaldiaData}
                    dataKey="votos"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                  >
                    {alcaldiaData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Total de votos: {totalAlcaldiaVotes}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Comparativa de Votos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[...presidenciaData.map(d => ({ ...d, category: 'Presidencia' })), ...alcaldiaData.map(d => ({ ...d, category: 'Alcaldía' }))]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="votos" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      {/* Stats */}
      <section>
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Votos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPresidenciaVotes + totalAlcaldiaVotes}</div>
              <p className="text-xs text-muted-foreground">Todas las categorías</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Participación</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.max(totalPresidenciaVotes, totalAlcaldiaVotes) > 0 ? '87%' : '0%'}
              </div>
              <p className="text-xs text-muted-foreground">Estimado</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Última Actualización</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{new Date().toLocaleTimeString()}</div>
              <p className="text-xs text-muted-foreground">Tiempo real</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
