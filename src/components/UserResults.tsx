import { motion } from "framer-motion";
import { CheckCircle2, TrendingUp, Users, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useApp } from "@/contexts/AppContext";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export function UserResults() {
  const { candidates, getUserVotes } = useApp();
  const userVotes = getUserVotes();

  const presidenciaCandidates = candidates.filter(
    (c) => c.category === "presidencia"
  );
  const alcaldiaCandidates = candidates.filter(
    (c) => c.category === "alcaldia"
  );

  const votedPresidente = presidenciaCandidates.find(
    (c) => c.id === userVotes.presidencia
  );
  const votedAlcalde = alcaldiaCandidates.find(
    (c) => c.id === userVotes.alcaldia
  );

  const totalPresidenciaVotes = presidenciaCandidates.reduce(
    (sum, c) => sum + c.votes,
    0
  );
  const totalAlcaldiaVotes = alcaldiaCandidates.reduce(
    (sum, c) => sum + c.votes,
    0
  );

  const presidenciaData = presidenciaCandidates.map((c) => ({
    name: c.name,
    votos: c.votes,
    percentage:
      totalPresidenciaVotes > 0
        ? ((c.votes / totalPresidenciaVotes) * 100).toFixed(1)
        : 0,
  }));

  const alcaldiaData = alcaldiaCandidates.map((c) => ({
    name: c.name,
    votos: c.votes,
    percentage:
      totalAlcaldiaVotes > 0
        ? ((c.votes / totalAlcaldiaVotes) * 100).toFixed(1)
        : 0,
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
                    <p className="font-semibold text-lg">
                      {votedPresidente.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {votedPresidente.party}
                    </p>
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
                    <p className="text-sm text-muted-foreground">
                      {votedAlcalde.party}
                    </p>
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
        <h2 className="text-2xl font-bold mb-6 text-foreground">
          Resultados Generales
        </h2>



        <Card>
          <CardHeader>
            <CardTitle>Comparativa de Votos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={[
                  ...presidenciaData.map((d) => ({
                    ...d,
                    category: "Presidencia",
                  })),
                  ...alcaldiaData.map((d) => ({ ...d, category: "Alcaldía" })),
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="votos"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Detailed Results Tables: separado por Presidencia y Alcaldía */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Resultados - Presidencia</CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const total = totalPresidenciaVotes;
                const rows = presidenciaCandidates
                  .slice()
                  .sort((a, b) => b.votes - a.votes)
                  .map((c, i) => ({
                    position: i + 1,
                    name: c.name,
                    party: c.party,
                    votos: c.votes,
                    percentage:
                      total > 0
                        ? Number(((c.votes / total) * 100).toFixed(1))
                        : 0,
                  }));

                const getPartyColor = (party: string) => {
                  switch ((party || "").toLowerCase()) {
                    case "partido progreso":
                      return "bg-blue-500 text-white";
                    case "unidad nacional":
                      return "bg-red-500 text-white";
                    case "verdes por el cambio":
                      return "bg-green-500 text-white";
                    case "frente democrático":
                      return "bg-yellow-600 text-white";
                    default:
                      return "bg-gray-200 text-gray-800";
                  }
                };

                return (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead>
                        <tr className="text-xs text-muted-foreground">
                          <th className="px-4 py-3">Pos</th>
                          <th className="px-4 py-3">Candidato</th>
                          <th className="px-4 py-3">Partido</th>
                          <th className="px-4 py-3">Votos</th>
                          <th className="px-4 py-3">%</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((row) => (
                          <tr key={row.position} className="border-t">
                            <td className="px-4 py-3 align-middle">
                              {row.position}
                            </td>
                            <td className="px-4 py-3 align-middle">
                              {row.name}
                            </td>
                            <td className="px-4 py-3 align-middle">
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPartyColor(
                                  row.party
                                )}`}
                              >
                                {row.party}
                              </span>
                            </td>
                            <td className="px-4 py-3 align-middle">
                              {row.votos.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 align-middle w-24 text-right">
                              {row.percentage}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })()}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resultados - Alcaldía</CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const total = totalAlcaldiaVotes;
                const rows = alcaldiaCandidates
                  .slice()
                  .sort((a, b) => b.votes - a.votes)
                  .map((c, i) => ({
                    position: i + 1,
                    name: c.name,
                    party: c.party,
                    votos: c.votes,
                    percentage:
                      total > 0
                        ? Number(((c.votes / total) * 100).toFixed(1))
                        : 0,
                  }));

                const getPartyColor = (party: string) => {
                  switch ((party || "").toLowerCase()) {
                    case "partido progreso":
                      return "bg-blue-500 text-white";
                    case "unidad nacional":
                      return "bg-red-500 text-white";
                    case "verdes por el cambio":
                      return "bg-green-500 text-white";
                    case "frente democrático":
                      return "bg-yellow-600 text-white";
                    default:
                      return "bg-gray-200 text-gray-800";
                  }
                };

                return (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead>
                        <tr className="text-xs text-muted-foreground">
                          <th className="px-4 py-3">Pos</th>
                          <th className="px-4 py-3">Candidato</th>
                          <th className="px-4 py-3">Partido</th>
                          <th className="px-4 py-3">Votos</th>
                          <th className="px-4 py-3">%</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((row) => (
                          <tr key={row.position} className="border-t">
                            <td className="px-4 py-3 align-middle">
                              {row.position}
                            </td>
                            <td className="px-4 py-3 align-middle">
                              {row.name}
                            </td>
                            <td className="px-4 py-3 align-middle">
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPartyColor(
                                  row.party
                                )}`}
                              >
                                {row.party}
                              </span>
                            </td>
                            <td className="px-4 py-3 align-middle">
                              {row.votos.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 align-middle w-24 text-right">
                              {row.percentage}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        </div>
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
              <div className="text-2xl font-bold">
                {totalPresidenciaVotes + totalAlcaldiaVotes}
              </div>
              <p className="text-xs text-muted-foreground">
                Todas las categorías
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Presidente Lider</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalPresidenciaVotes + totalAlcaldiaVotes}
              </div>
              <p className="text-xs text-muted-foreground">
              	0 votos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Alcalde Lider</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalPresidenciaVotes + totalAlcaldiaVotes}
              </div>
              <p className="text-xs text-muted-foreground">
                0 votos
              </p>
            </CardContent>
          </Card>

          {/*<Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Presidente Líder</p>
                <p className="text-lg font-bold text-card-foreground">{topPresident.name}</p>
                <p className="text-sm text-muted-foreground">{topPresident.votes || 0} votos</p>
              </div>
              <TrendingUp className="h-12 w-12 text-success/20" />
            </div>
          </Card>*/}

          <div className="grid gap-4 grid-cols-2 col-span-3">
	          <Card>
	            <CardHeader className="flex flex-row items-center justify-between pb-2">
	              <CardTitle className="text-sm font-medium">
	                Participación
	              </CardTitle>
	              <TrendingUp className="h-4 w-4 text-muted-foreground" />
	            </CardHeader>
	            <CardContent>
	              <div className="text-2xl font-bold">
	                {Math.max(totalPresidenciaVotes, totalAlcaldiaVotes) > 0
	                  ? "87%"
	                  : "0%"}
	              </div>
	              <p className="text-xs text-muted-foreground">Estimado</p>
	            </CardContent>
	          </Card>
	          <Card>
	            <CardHeader className="flex flex-row items-center justify-between pb-2">
	              <CardTitle className="text-sm font-medium">
	                Última Actualización
	              </CardTitle>
	              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
	            </CardHeader>
	            <CardContent>
	              <div className="text-2xl font-bold">
	                {new Date().toLocaleTimeString()}
	              </div>
	              <p className="text-xs text-muted-foreground">Tiempo real</p>
	            </CardContent>
	          </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
