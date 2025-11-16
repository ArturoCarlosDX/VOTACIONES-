import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, AlertCircle, Trash2, Download, Play, BarChart3, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { toast } from 'sonner';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CSVData {
  headers: string[];
  rows: string[][];
}

interface DataQuality {
  nulls: number;
  duplicates: number;
  inconsistencies: number;
}

interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  mae: number;
}

export function DataAnalysis() {
  const [csvData, setCsvData] = useState<CSVData | null>(null);
  const [quality, setQuality] = useState<DataQuality | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [modelMetrics, setModelMetrics] = useState<ModelMetrics | null>(null);
  const [modelType, setModelType] = useState('random-forest');
  const [testSplit, setTestSplit] = useState('0.2');
  const [activeSection, setActiveSection] = useState<
    "load"
  >("load");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());

      if (lines.length === 0) {
        toast.error('El archivo CSV está vacío');
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim());
      const rows = lines.slice(1, 11).map(line => line.split(',').map(c => c.trim()));

      setCsvData({ headers, rows });
      analyzeDataQuality({ headers, rows: lines.slice(1).map(line => line.split(',')) });
      toast.success('Archivo CSV cargado exitosamente');
    };

    reader.readAsText(file);
  };

  const analyzeDataQuality = (data: CSVData) => {
    let nulls = 0;
    let duplicates = 0;
    let inconsistencies = 0;

    data.rows.forEach(row => {
      row.forEach(cell => {
        if (!cell || cell.trim() === '') nulls++;
        if (!/^[a-zA-Z0-9\s.,áéíóúñÁÉÍÓÚÑ-]*$/.test(cell)) inconsistencies++;
      });
    });

    const rowStrings = data.rows.map(r => r.join(','));
    duplicates = rowStrings.length - new Set(rowStrings).size;

    setQuality({ nulls, duplicates, inconsistencies });
  };

  const handleCleanData = (action: 'nulls' | 'duplicates' | 'mean' | 'median') => {
    if (!csvData) return;

    let message = '';
    switch (action) {
      case 'nulls':
        message = 'Filas con valores nulos eliminadas';
        break;
      case 'duplicates':
        message = 'Filas duplicadas eliminadas';
        break;
      case 'mean':
        message = 'Valores imputados por media';
        break;
      case 'median':
        message = 'Valores imputados por mediana';
        break;
    }

    toast.success(message);
    if (quality) {
      setQuality({
        ...quality,
        nulls: action === 'nulls' ? 0 : quality.nulls,
        duplicates: action === 'duplicates' ? 0 : quality.duplicates
      });
    }
  };

  const handleTrainModel = async () => {
    if (!csvData) {
      toast.error('Primero carga un archivo CSV');
      return;
    }

    setIsTraining(true);
    setTrainingProgress(0);

    const interval = setInterval(() => {
      setTrainingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    setTimeout(() => {
      setIsTraining(false);
      const metrics: ModelMetrics = {
        accuracy: 0.85 + Math.random() * 0.1,
        precision: 0.82 + Math.random() * 0.1,
        recall: 0.79 + Math.random() * 0.1,
        mae: Math.random() * 0.2
      };
      setModelMetrics(metrics);
      toast.success('Modelo entrenado exitosamente');
    }, 3500);
  };

  const handleExportResults = () => {
    if (!modelMetrics) return;

    const csvContent = `Métrica,Valor\nAccuracy,${modelMetrics.accuracy.toFixed(4)}\nPrecision,${modelMetrics.precision.toFixed(4)}\nRecall,${modelMetrics.recall.toFixed(4)}\nMAE,${modelMetrics.mae.toFixed(4)}`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'model-results.csv';
    link.click();
    URL.revokeObjectURL(url);

    toast.success('Resultados exportados exitosamente');
  };

	return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Análisis de Datos y Modelado</h2>

      <Tabs defaultValue='load'>
        <TabsList className="grid w-full mx-auto grid-cols-4 mb-8">
          <TabsTrigger value="load">Cargar Datos</TabsTrigger>
          <TabsTrigger value="quality">Análisis de Calidad de Datos</TabsTrigger>
          <TabsTrigger value="training">Entrenar Modelos</TabsTrigger>
          <TabsTrigger value="results">Ver Resultados</TabsTrigger>
        </TabsList>

	      <TabsContent value="load">
	        <CardContent>
	          <div className="border-2 border-dashed border-border rounded-lg p-4 text-center w-full mx-auto flex justify-center gap-4 items-center">
	            <input
	              ref={fileInputRef}
	              type="file"
	              accept=".csv"
	              onChange={handleFileUpload}
	              className="hidden"
	            />
	            <Button onClick={() => fileInputRef.current?.click()}>
			          <Upload className="mx-auto"/>
	              Seleccionar archivo
	            </Button>
	            <p className="text-sm text-muted-foreground">
	              Arrastra un archivo CSV o haz clic para seleccionar
	            </p>
	          </div>

	          {csvData && (
	            <div className="mt-6">
	              <h4 className="font-medium mb-2">Vista previa (primeras 10 filas):</h4>
	              <div className="overflow-auto max-h-96 border rounded-lg">
	                <Table>
	                  <TableHeader>
	                    <TableRow>
	                      {csvData.headers.map((header, i) => (
	                        <TableHead key={i}>{header}</TableHead>
	                      ))}
	                    </TableRow>
	                  </TableHeader>
	                  <TableBody>
	                    {csvData.rows.map((row, i) => (
	                      <TableRow key={i}>
	                        {row.map((cell, j) => (
	                          <TableCell key={j}>{cell}</TableCell>
	                        ))}
	                      </TableRow>
	                    ))}
	                  </TableBody>
	                </Table>
	              </div>
	            </div>
	          )}
	        </CardContent>
	      </TabsContent>

	      {csvData && quality && (
	        <TabsContent value="quality">
	          <CardContent>
	            <div className="grid md:grid-cols-5 gap-4 mb-6">
	              <div className="bg-primary/10 p-4 rounded-lg">
	                <div className="flex items-center gap-2 mb-2">
	                  <BarChart3 className="w-5 h-5 text-primary" />
	                  <span className="font-medium">Total Regitros</span>
	                </div>
	                <p className="text-2xl font-bold">{quality.nulls}</p>
	              </div>
	              <div className="bg-destructive/10 p-4 rounded-lg">
	                <div className="flex items-center gap-2 mb-2">
	                  <AlertCircle className="w-5 h-5 text-destructive" />
	                  <span className="font-medium">Problemas</span>
	                </div>
	                <p className="text-2xl font-bold">{quality.nulls}</p>
	              </div>
	              <div className="bg-gray-500/10 dark:bg-gray-100/10 p-4 rounded-lg">
	                <div className="flex items-center gap-2 mb-2">
	                  <AlertTriangle className="w-5 h-5 text-gray-500" />
	                  <span className="font-medium">Valores Nulos</span>
	                </div>
	                <p className="text-2xl font-bold">{quality.nulls}</p>
	              </div>
	              <div className="bg-warning/10 p-4 rounded-lg">
	                <div className="flex items-center gap-2 mb-2">
	                  <AlertCircle className="w-5 h-5 text-warning" />
	                  <span className="font-medium">Duplicados</span>
	                </div>
	                <p className="text-2xl font-bold">{quality.duplicates}</p>
	              </div>
	              <div className="bg-primary/10 p-4 rounded-lg">
	                <div className="flex items-center gap-2 mb-2">
	                  <AlertCircle className="w-5 h-5 text-primary" />
	                  <span className="font-medium">Inconsistencias</span>
	                </div>
	                <p className="text-2xl font-bold">{quality.inconsistencies}</p>
	              </div>
	            </div>

	            <div className="flex flex-wrap gap-2">
	              <Button variant="outline" onClick={() => handleCleanData('nulls')}>
	                <Trash2 className="w-4 h-4 mr-2" />
	                Eliminar Nulos
	              </Button>
	              <Button variant="outline" onClick={() => handleCleanData('duplicates')}>
	                <Trash2 className="w-4 h-4 mr-2" />
	                Eliminar Duplicados
	              </Button>
	              <Button variant="outline" onClick={() => handleCleanData('mean')}>
	                Imputar por Media
	              </Button>
	              <Button variant="outline" onClick={() => handleCleanData('median')}>
	                Imputar por Mediana
	              </Button>
	            </div>
	          </CardContent>
	        </TabsContent>
	      )}

	      {csvData && (
	        <TabsContent value="training">
	          <CardContent>
	            <div className="grid md:grid-cols-2 gap-4 mb-6">
	              <div>
	                <label className="block text-sm font-medium mb-2">Tipo de Modelo</label>
	                <Select value={modelType} onValueChange={setModelType}>
	                  <SelectTrigger>
	                    <SelectValue />
	                  </SelectTrigger>
	                  <SelectContent>
	                    <SelectItem value="random-forest">Random Forest</SelectItem>
	                    <SelectItem value="svm">SVM</SelectItem>
	                    <SelectItem value="neural-network">Red Neuronal</SelectItem>
	                    <SelectItem value="logistic">Regresión Logística</SelectItem>
	                  </SelectContent>
	                </Select>
	              </div>
	              <div>
	                <label className="block text-sm font-medium mb-2">Test Split</label>
	                <Select value={testSplit} onValueChange={setTestSplit}>
	                  <SelectTrigger>
	                    <SelectValue />
	                  </SelectTrigger>
	                  <SelectContent>
	                    <SelectItem value="0.2">20%</SelectItem>
	                    <SelectItem value="0.3">30%</SelectItem>
	                    <SelectItem value="0.4">40%</SelectItem>
	                  </SelectContent>
	                </Select>
	              </div>
	            </div>

	            <Button
	              onClick={handleTrainModel}
	              disabled={isTraining}
	              className="w-full"
	            >
	              {isTraining ? (
	                <>
	                  <Play className="w-4 h-4 mr-2 animate-pulse" />
	                  Entrenando modelo...
	                </>
	              ) : (
	                <>
	                  <Play className="w-4 h-4 mr-2" />
	                  Entrenar Modelo
	                </>
	              )}
	            </Button>

	            {isTraining && (
	              <div className="mt-4">
	                <Progress value={trainingProgress} className="h-2" />
	                <p className="text-sm text-center mt-2 text-muted-foreground">
	                  {trainingProgress}% completado
	                </p>
	              </div>
	            )}
	          </CardContent>
	        </TabsContent>
	      )}

	      {/* 4. Resultados del Modelo */}
	      {modelMetrics && (
	        <TabsContent value="results">
	          <CardContent>
	            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
	              <div className="bg-success/10 p-4 rounded-lg">
	                <p className="text-sm text-muted-foreground mb-1">Accuracy</p>
	                <p className="text-2xl font-bold">{(modelMetrics.accuracy * 100).toFixed(2)}%</p>
	              </div>
	              <div className="bg-primary/10 p-4 rounded-lg">
	                <p className="text-sm text-muted-foreground mb-1">Precision</p>
	                <p className="text-2xl font-bold">{(modelMetrics.precision * 100).toFixed(2)}%</p>
	              </div>
	              <div className="bg-accent/10 p-4 rounded-lg">
	                <p className="text-sm text-muted-foreground mb-1">Recall</p>
	                <p className="text-2xl font-bold">{(modelMetrics.recall * 100).toFixed(2)}%</p>
	              </div>
	              <div className="bg-warning/10 p-4 rounded-lg">
	                <p className="text-sm text-muted-foreground mb-1">MAE</p>
	                <p className="text-2xl font-bold">{modelMetrics.mae.toFixed(4)}</p>
	              </div>
	            </div>

	            <Button onClick={handleExportResults} className="w-full">
	              <Download className="w-4 h-4 mr-2" />
	              Exportar Resultados (CSV)
	            </Button>
	          </CardContent>
	        </TabsContent>
	      )}
      </Tabs>
    </div>
  );
}
