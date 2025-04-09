"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LineChart, BarChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface AIDetailedViewProps {
  metricId: string
}

interface LogEntry {
  timestamp: string
  event: string
  value: string
  type: "info" | "warning" | "error" | "success"
}

const sampleLogs: Record<string, LogEntry[]> = {
  latency: [
    { timestamp: "2024-03-10 15:42:23", event: "Response time spike detected", value: "156ms", type: "warning" },
    { timestamp: "2024-03-10 15:30:12", event: "System optimization completed", value: "42ms", type: "success" },
    { timestamp: "2024-03-10 15:15:45", event: "Load balancer adjusted", value: "38ms", type: "info" },
    { timestamp: "2024-03-10 14:55:30", event: "High traffic period", value: "78ms", type: "info" },
    { timestamp: "2024-03-10 14:30:00", event: "Performance check", value: "45ms", type: "info" },
  ],
  throughput: [
    { timestamp: "2024-03-10 15:45:00", event: "New throughput record", value: "1,240 req/s", type: "success" },
    { timestamp: "2024-03-10 15:30:00", event: "Traffic surge handled", value: "1,150 req/s", type: "info" },
    { timestamp: "2024-03-10 15:15:00", event: "Auto-scaling triggered", value: "980 req/s", type: "warning" },
    { timestamp: "2024-03-10 15:00:00", event: "Normal operation", value: "850 req/s", type: "info" },
  ],
  accuracy: [
    { timestamp: "2024-03-10 15:40:00", event: "Model accuracy improved", value: "98.3%", type: "success" },
    { timestamp: "2024-03-10 15:25:00", event: "Training iteration completed", value: "97.8%", type: "info" },
    { timestamp: "2024-03-10 15:10:00", event: "Data validation check", value: "97.5%", type: "info" },
    { timestamp: "2024-03-10 14:55:00", event: "Accuracy dip detected", value: "97.1%", type: "warning" },
  ],
  resources: [
    { timestamp: "2024-03-10 15:44:00", event: "Memory usage optimized", value: "76%", type: "success" },
    { timestamp: "2024-03-10 15:30:00", event: "CPU spike detected", value: "92%", type: "warning" },
    { timestamp: "2024-03-10 15:15:00", event: "Resource allocation adjusted", value: "82%", type: "info" },
    { timestamp: "2024-03-10 15:00:00", event: "System health check", value: "78%", type: "info" },
  ],
  availability: [
    { timestamp: "2024-03-10 15:45:00", event: "System fully operational", value: "99.99%", type: "success" },
    { timestamp: "2024-03-10 15:30:00", event: "Maintenance completed", value: "99.95%", type: "info" },
    { timestamp: "2024-03-10 15:15:00", event: "Scheduled maintenance", value: "99.90%", type: "warning" },
    { timestamp: "2024-03-10 15:00:00", event: "Health check passed", value: "99.99%", type: "info" },
  ],
}

const performanceData = [
  { name: '00:00', value: 42 },
  { name: '04:00', value: 38 },
  { name: '08:00', value: 45 },
  { name: '12:00', value: 78 },
  { name: '16:00', value: 56 },
  { name: '20:00', value: 42 },
  { name: '24:00', value: 39 },
]

const detailedMetrics = {
  latency: {
    current: { value: "42ms", change: "-8%" },
    peak: { value: "156ms", time: "15:42" },
    average: { value: "48ms", period: "24h" },
    minimum: { value: "22ms", time: "03:15" }
  },
  throughput: {
    current: { value: "1,240 req/s", change: "+12%" },
    peak: { value: "2,150 req/s", time: "14:30" },
    average: { value: "950 req/s", period: "24h" },
    minimum: { value: "420 req/s", time: "02:00" }
  },
  accuracy: {
    current: { value: "98.3%", change: "+0.5%" },
    peak: { value: "99.1%", time: "16:45" },
    average: { value: "97.8%", period: "24h" },
    minimum: { value: "96.5%", time: "08:20" }
  },
  resources: {
    current: { value: "76%", change: "+4%" },
    peak: { value: "92%", time: "15:30" },
    average: { value: "68%", period: "24h" },
    minimum: { value: "45%", time: "01:00" }
  },
  availability: {
    current: { value: "99.99%", change: "0%" },
    peak: { value: "100%", time: "12:00" },
    average: { value: "99.95%", period: "24h" },
    minimum: { value: "99.90%", time: "09:15" }
  }
}

export function AIDetailedView({ metricId }: AIDetailedViewProps) {
  const logs = sampleLogs[metricId] || []
  const metrics = detailedMetrics[metricId as keyof typeof detailedMetrics] || {}

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <Card>
          <CardContent className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Statistics</div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium">Average</div>
                    <div className="text-2xl font-bold">{metrics.average?.value || "N/A"}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Current</div>
                    <div className="text-2xl font-bold">{metrics.current?.value || "N/A"}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Peak</div>
                    <div className="text-2xl font-bold">{metrics.peak?.value || "N/A"}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Minimum</div>
                    <div className="text-2xl font-bold">{metrics.minimum?.value || "N/A"}</div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Performance</div>
                <div className="h-[120px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="details">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Metrics</CardTitle>
              <CardDescription>Comprehensive analysis of performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Current Status</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Value</span>
                    <span className="text-sm font-medium">{metrics.current?.value}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Change</span>
                    <span className={`text-sm font-medium ${
                      metrics.current?.change?.startsWith('+') ? 'text-green-600' : 
                      metrics.current?.change?.startsWith('-') ? 'text-red-600' : 
                      'text-blue-600'
                    }`}>{metrics.current?.change}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Peak Performance</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Value</span>
                    <span className="text-sm font-medium">{metrics.peak?.value}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Time</span>
                    <span className="text-sm font-medium">{metrics.peak?.time}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Performance Analysis</CardTitle>
              <CardDescription>24-hour performance breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#2563eb" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      <TabsContent value="history">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historical Trend</CardTitle>
              <CardDescription>Performance trend over the last 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Logs</CardTitle>
              <CardDescription>Recent system events and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {logs.map((log, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-white border-2 border-gray-100 hover:border-blue-100 transition-all"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-2 h-2 rounded-full ${
                          log.type === 'success' ? 'bg-green-500' :
                          log.type === 'warning' ? 'bg-yellow-500' :
                          log.type === 'error' ? 'bg-red-500' :
                          'bg-blue-500'
                        }`} />
                        <div>
                          <div className="text-sm font-medium">{log.event}</div>
                          <div className="text-xs text-muted-foreground">{log.timestamp}</div>
                        </div>
                      </div>
                      <div className="text-sm font-medium">{log.value}</div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  )
}

function getMetricName(metricId: string): string {
  const metricNames: Record<string, string> = {
    latency: "Latency",
    throughput: "Throughput",
    accuracy: "Accuracy",
    resources: "Resource Usage",
    availability: "System Availability",
  }

  return metricNames[metricId] || "Metric"
}

function getDetailedChartPlaceholder(metricId: string): string {
  const chartDescriptions: Record<string, string> = {
    latency: "Response Time Distribution Chart",
    throughput: "Requests Per Second Chart",
    accuracy: "Model Precision & Recall Chart",
    resources: "CPU & Memory Usage Chart",
    availability: "System Uptime Chart",
  }

  return chartDescriptions[metricId] || "Detailed Chart"
}

function getMetricStatistics(metricId: string): { name: string; value: string }[] {
  const statistics: Record<string, { name: string; value: string }[]> = {
    latency: [
      { name: "Average", value: "42ms" },
      { name: "Median", value: "38ms" },
      { name: "95th Percentile", value: "78ms" },
      { name: "99th Percentile", value: "120ms" },
      { name: "Min", value: "22ms" },
      { name: "Max", value: "156ms" },
    ],
    throughput: [
      { name: "Average", value: "1,240 req/s" },
      { name: "Peak", value: "2,450 req/s" },
      { name: "Current", value: "1,320 req/s" },
      { name: "Total Requests", value: "5.2M" },
      { name: "Success Rate", value: "99.8%" },
      { name: "Error Rate", value: "0.2%" },
    ],
    accuracy: [
      { name: "Precision", value: "98.3%" },
      { name: "Recall", value: "97.5%" },
      { name: "F1 Score", value: "97.9%" },
      { name: "AUC", value: "0.992" },
      { name: "False Positives", value: "1.2%" },
      { name: "False Negatives", value: "1.3%" },
    ],
    resources: [
      { name: "CPU Usage", value: "76%" },
      { name: "Memory Usage", value: "82%" },
      { name: "GPU Usage", value: "68%" },
      { name: "Disk I/O", value: "42 MB/s" },
      { name: "Network I/O", value: "120 MB/s" },
      { name: "Active Instances", value: "12" },
    ],
    availability: [
      { name: "Uptime", value: "99.99%" },
      { name: "MTTR", value: "4m 12s" },
      { name: "MTBF", value: "45d 6h" },
      { name: "Incidents (30d)", value: "1" },
      { name: "Scheduled Maintenance", value: "2h 30m" },
      { name: "SLA Compliance", value: "100%" },
    ],
  }

  return statistics[metricId] || []
}
