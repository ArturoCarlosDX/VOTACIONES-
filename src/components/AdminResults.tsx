import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useApp } from "@/contexts/AppContext";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "./ui/button";

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export function AdminResults() {
  const { candidates } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "presidencia" | "alcaldia"
  >("all");

  const presidenciaCandidates = candidates.filter(
    (c) => c.category === "presidencia"
  );
  const alcaldiaCandidates = candidates.filter(
    (c) => c.category === "alcaldia"
  );

  const getChartData = (category: "presidencia" | "alcaldia") => {
    const filtered =
      category === "presidencia" ? presidenciaCandidates : alcaldiaCandidates;
    return filtered.map((c) => ({
      name: c.name,
      votos: c.votes,
      partido: c.party,
    }));
  };

  const getTotalVotes = (category: "presidencia" | "alcaldia") => {
    return (
      category === "presidencia" ? presidenciaCandidates : alcaldiaCandidates
    ).reduce((sum, c) => sum + c.votes, 0);
  };

  const presidenciaData = getChartData("presidencia");
  const alcaldiaData = getChartData("alcaldia");
  const presidenciaTotalVotes = getTotalVotes("presidencia");
  const alcaldiaTotalVotes = getTotalVotes("alcaldia");
  const totalVotes = presidenciaTotalVotes + alcaldiaTotalVotes;

  // Get filtered candidates based on selected category
  const getFilteredCandidates = () => {
    if (selectedCategory === "presidencia") return presidenciaCandidates;
    if (selectedCategory === "alcaldia") return alcaldiaCandidates;
    return candidates;
  };

  const filteredCandidates = getFilteredCandidates();
  const filteredTotal = filteredCandidates.reduce((sum, c) => sum + c.votes, 0);

  const pieData = filteredCandidates.map((c) => ({
    name: c.name,
    value: c.votes,
    percentage:
      filteredTotal > 0 ? ((c.votes / filteredTotal) * 100).toFixed(1) : 0,
  }));

  // Simulated time series data based on selected category
  const timeSeriesData = [
    { time: "08:00", votos: Math.floor(filteredTotal * 0.1) },
    { time: "10:00", votos: Math.floor(filteredTotal * 0.3) },
    { time: "12:00", votos: Math.floor(filteredTotal * 0.5) },
    { time: "14:00", votos: Math.floor(filteredTotal * 0.7) },
    { time: "16:00", votos: Math.floor(filteredTotal * 0.9) },
    { time: "18:00", votos: filteredTotal },
  ];

  // Get leader for selected category
  const getLeader = () => {
    if (filteredCandidates.length === 0) return "N/A";
    const leader = filteredCandidates.reduce((max, c) => {
      if (!max || c.votes > max.votes) return c;
      return max;
    }, null as any);
    return leader ? leader.name : "N/A";
  };

  // Get max votes safely
  const getMaxVotes = () => {
    if (filteredCandidates.length === 0) return 0;
    return Math.max(...filteredCandidates.map((c) => c.votes || 0));
  };

  const handleExport = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "black";
      ctx.font = "24px Arial";
      ctx.fillText("Resultados Electorales", 50, 50);
    }

    const link = document.createElement("a");
    link.download = "resultados-electorales.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center relative z-10">
        <h2 className="text-2xl font-bold">Resultados Generales</h2>
        <div className="flex gap-4 items-center relative">
          <Select
            value={selectedCategory}
            onValueChange={(v: any) => setSelectedCategory(v)}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="z-50">
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
        {(selectedCategory === "all" || selectedCategory === "presidencia") && (
          <Card>
            <CardHeader>
              <CardTitle>Resultados - Presidente</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={presidenciaData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="votos" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {(selectedCategory === "all" || selectedCategory === "alcaldia") && (
          <Card>
            <CardHeader>
              <CardTitle>Resultados - Alcalde</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={alcaldiaData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="votos" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {(selectedCategory === "all" || selectedCategory === "presidencia") && (
          <Card>
            <CardHeader>
              <CardTitle>Participación por Zona</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="votos"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {(selectedCategory === "all" || selectedCategory === "alcaldia") && (
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
                  <Line
                    type="monotone"
                    dataKey="votos"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total de Votos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{filteredTotal}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Candidato Líder</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{getLeader()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Máximo de Votos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{getMaxVotes()}</p>
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
              <p className="text-3xl font-bold">
                {filteredTotal > 0 ? "87%" : "0%"}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
