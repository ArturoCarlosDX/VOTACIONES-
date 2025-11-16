import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useApp } from '@/contexts/AppContext';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from './ui/button';

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export function AdminResults() {
  const { candidates } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'presidencia' | 'alcaldia'>('all');

  const filteredCandidates = selectedCategory === 'all'
    ? candidates
    : candidates.filter(c => c.category === selectedCategory);

  const chartData = filteredCandidates.map(c => ({
    name: c.name,
    votos: c.votes,
    partido: c.party,
    category: c.category === 'presidencia' ? 'Presidencia' : 'Alcaldía'
  }));

  const totalVotes = filteredCandidates.reduce((sum, c) => sum + c.votes, 0);

  const pieData = filteredCandidates.map(c => ({
    name: c.name,
    value: c.votes,
    percentage: totalVotes > 0 ? ((c.votes / totalVotes) * 100).toFixed(1) : 0
  }));

  // Simulated time series data
  const timeSeriesData = [
    { time: '08:00', votos: Math.floor(totalVotes * 0.1) },
    { time: '10:00', votos: Math.floor(totalVotes * 0.3) },
    { time: '12:00', votos: Math.floor(totalVotes * 0.5) },
    { time: '14:00', votos: Math.floor(totalVotes * 0.7) },
    { time: '16:00', votos: Math.floor(totalVotes * 0.9) },
    { time: '18:00', votos: totalVotes }
  ];

  const handleExport = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'black';
      ctx.font = '24px Arial';
      ctx.fillText('Resultados Electorales', 50, 50);
    }

    const link = document.createElement('a');
    link.download = 'resultados-electorales.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Resultados Generales</h2>
        <div className="flex gap-4 items-center">
          <Select value={selectedCategory} onValueChange={(v: any) => setSelectedCategory(v)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              <SelectItem value="presidencia">Solo Presidencia</SelectItem>
              <SelectItem value="alcaldia">Solo Alcaldía</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Votos (Pastel)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Votos por Candidato (Barras)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="votos" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Evolución de Votos (Serie Temporal)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="votos" stroke="hsl(var(--primary))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total de Votos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalVotes}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Presidente Lider</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalVotes}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Alcalde Lider</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalVotes}</p>
          </CardContent>
        </Card>
        <div className="grid gap-4 grid-cols-2 col-span-3">
	        <Card>
	          <CardHeader>
	            <CardTitle className="text-sm">Candidatos</CardTitle>
	          </CardHeader>
	          <CardContent>
	            <p className="text-3xl font-bold">{filteredCandidates.length}</p>
	          </CardContent>
	        </Card>
	        <Card>
	          <CardHeader>
	            <CardTitle className="text-sm">Participación</CardTitle>
	          </CardHeader>
	          <CardContent>
	            <p className="text-3xl font-bold">{totalVotes > 0 ? '87%' : '0%'}</p>
	          </CardContent>
	        </Card>
        </div>
      </div>
    </div>
  );
}
