"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface AIDetailedViewProps {
  metricId: string
}

export function AIDetailedView({ metricId }: AIDetailedViewProps) {
  return (
    <div className="space-y-4">
      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-2 bg-blue-50 rounded-xl overflow-hidden">
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Overview
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            History
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-gray-200 rounded-2xl transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Detailed Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] w-full bg-blue-50/50 rounded-md flex items-center justify-center text-blue-600">
                  {getDetailedChartPlaceholder(metricId)}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-gray-200 rounded-2xl transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 gap-4 text-sm">
                  {getMetricStatistics(metricId).map((stat, index) => (
                    <div key={index} className="flex flex-col">
                      <dt className="text-muted-foreground">{stat.name}</dt>
                      <dd className="font-medium">{stat.value}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          </div>
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-gray-200 rounded-2xl transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle>Performance Analysis</CardTitle>
              <CardDescription>Detailed analysis of {getMetricName(metricId)} performance over time.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full bg-blue-50/50 rounded-md flex items-center justify-center text-blue-600">
                {getMetricName(metricId)} Performance Analysis Chart
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history">
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-gray-200 rounded-2xl transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle>Historical Data</CardTitle>
              <CardDescription>View historical data for {getMetricName(metricId)}.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-[400px] w-full bg-blue-50/50 rounded-md flex items-center justify-center text-blue-600">
                  Historical {getMetricName(metricId)} Data Chart
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
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
