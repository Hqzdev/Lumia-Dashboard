"use client"

import { useState, useCallback } from "react"
import { Activity, Brain, Clock, Cpu, Database, Maximize2, RefreshCw, Server } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"

import { AIMetricCard } from "@/components/ai-metric-card"
import { AIDetailedView } from "@/components/ai-detailed-view"
import AnimatedGradient from "@/components/animated-gradient"
import FloatingElements from "@/components/floating-elements"

// Add animation keyframes
const animations = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.5s ease-out forwards;
  }
  
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
  }
  .animate-slide-in {
    animation: slideIn 0.5s ease-out forwards;
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  .animate-pulse-slow {
    animation: pulse 3s infinite ease-in-out;
  }
`

export default function Dashboard() {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const metrics = [
    {
      id: "latency",
      title: "Latency",
      description: "Average response time",
      value: "42ms",
      change: "-8%",
      historical: "↓ 12% from last month",
      icon: Clock,
      color: "text-blue-500",
    },
    {
      id: "throughput",
      title: "Throughput",
      description: "Requests per second",
      value: "1,240",
      change: "+12%",
      historical: "↑ 8% from last month",
      icon: Activity,
      color: "text-blue-600",
    },
    {
      id: "accuracy",
      title: "Accuracy",
      description: "Model precision",
      value: "98.3%",
      change: "+0.5%",
      historical: "↑ 1.2% from last month",
      icon: Brain,
      color: "text-blue-700",
    },
    {
      id: "resources",
      title: "Resources",
      description: "CPU & Memory usage",
      value: "76%",
      change: "+4%",
      historical: "↑ 2% from last month",
      icon: Cpu,
      color: "text-blue-800",
    },
    {
      id: "availability",
      title: "Availability",
      description: "System uptime",
      value: "99.99%",
      change: "0%",
      historical: "↑ 0.01% from last month",
      icon: Server,
      color: "text-blue-900",
    },
  ]

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true)

    // Simulate a refresh with a timeout
    setTimeout(() => {
      setIsRefreshing(false)
      toast({
        title: "Dashboard refreshed",
        description: "All metrics have been updated with the latest data.",
      })
    }, 1500)
  }, [])

  return (
    <>
      <style jsx global>
        {animations}
      </style>
      <div className="flex min-h-screen flex-col bg-white/80 backdrop-blur-sm items-center">
        <AnimatedGradient />
        <FloatingElements />
        <header className="sticky top-0 z-10 rounded-2xl  w-[300px]">
          <div className="container flex h-16 items-center justify-between py-4">
            <div className="flex items-center gap-2">
              <Database className="h-6 w-6 text-blue-600 ml-5" />
              <h1 className="text-xl font-bold ml-5 "><span className="bg-gradient-to-r from-blue-500 to-blue-800 text-transparent bg-clip-text">Lumia AI</span> Dashboard</h1>
            </div>
           
          </div>
        </header>
        <main className="flex-1">
          <div className="container py-6">
            <Tabs defaultValue="overview" className="space-y-4">
              <div className="flex items-center justify-between">
                <TabsList className="bg-blue-50 rounded-xl overflow-hidden">
                  <TabsTrigger
                    value="overview"
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="models"
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    Models
                  </TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="bg-blue-600 hover:bg-blue-700 rounded-xl transition-all hover:shadow-md"
                  >
                    {isRefreshing ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Refreshing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Refresh
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                  {metrics.map((metric, index) => (
                    <Dialog key={metric.id}>
                      <DialogTrigger asChild>
                        <div
                          onClick={() => setSelectedMetric(metric.id)}
                          className="animate-fade-in"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <AIMetricCard metric={metric} />
                        </div>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[725px] bg-white/95 backdrop-blur-md rounded-2xl border-2 border-gray-200">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <metric.icon className={`h-5 w-5 ${metric.color}`} />
                            {metric.title} Metrics
                          </DialogTitle>
                          <DialogDescription>
                            Detailed information about {metric.title.toLowerCase()} performance.
                          </DialogDescription>
                        </DialogHeader>
                        <AIDetailedView metricId={metric.id} />
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                  <Card className="bg-white/90 backdrop-blur-sm border-2 border-gray-200 rounded-2xl transition-all hover:shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Model Performance Overview</CardTitle>
                      <Maximize2 className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px] w-full bg-blue-50/50 rounded-md flex flex-col items-center justify-center p-4">
                        <div className="w-full space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-muted-foreground">Overall Performance</span>
                              <span className="text-sm font-medium text-blue-600">94.2%</span>
                            </div>
                            <div className="h-2 w-full bg-blue-100 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-600 w-[94%]" />
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">Latency</span>
                                <span className="text-xs text-blue-600">42ms</span>
                              </div>
                              <div className="h-1.5 w-full bg-blue-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-600 w-[85%]" />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">Accuracy</span>
                                <span className="text-xs text-blue-600">98.3%</span>
                              </div>
                              <div className="h-1.5 w-full bg-blue-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-600 w-[98%]" />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">Throughput</span>
                                <span className="text-xs text-blue-600">1.2k/s</span>
                              </div>
                              <div className="h-1.5 w-full bg-blue-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-600 w-[92%]" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/90 backdrop-blur-sm border-2 border-gray-200 rounded-2xl transition-all hover:shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">System Health</CardTitle>
                      <Maximize2 className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px] w-full bg-blue-50/50 rounded-md flex flex-col items-center justify-center p-4">
                        <div className="w-full space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-muted-foreground">System Status</span>
                              <span className="text-sm font-medium text-green-600">Healthy</span>
                            </div>
                            <div className="h-2 w-full bg-green-100 rounded-full overflow-hidden">
                              <div className="h-full bg-green-600 w-[96%]" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">CPU Usage</span>
                                <span className="text-xs text-blue-600">76%</span>
                              </div>
                              <div className="h-1.5 w-full bg-blue-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-600 w-[76%]" />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">Memory</span>
                                <span className="text-xs text-blue-600">82%</span>
                              </div>
                              <div className="h-1.5 w-full bg-blue-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-600 w-[82%]" />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">Network</span>
                                <span className="text-xs text-blue-600">120MB/s</span>
                              </div>
                              <div className="h-1.5 w-full bg-blue-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-600 w-[65%]" />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">Storage</span>
                                <span className="text-xs text-blue-600">42%</span>
                              </div>
                              <div className="h-1.5 w-full bg-blue-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-600 w-[42%]" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="models" className="space-y-4">
                <Card className="bg-white/90 backdrop-blur-sm border-2 border-gray-200 rounded-2xl transition-all hover:shadow-md">
                  <CardHeader>
                    <CardTitle>AI Models</CardTitle>
                    <CardDescription>Overview of deployed AI models and their performance.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {["Lumia V2", "Lumia V1 Max", "Lumia V2 Pro"].map((model, index) => (
                        <Card
                          key={model}
                          className="bg-white/80 border-2 border-gray-200 rounded-2xl transition-all hover:shadow-md hover:border-blue-200 animate-slide-in"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <CardHeader className="pb-2">
                            <CardTitle className="text-md font-medium">{model}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid md:grid-cols-4 gap-4">
                              <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Status</p>
                                <p className="text-sm font-medium text-blue-600">Active</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Accuracy</p>
                                <p className="text-sm font-medium">98.2%</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Latency</p>
                                <p className="text-sm font-medium">45ms</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Usage</p>
                                <p className="text-sm font-medium">12,450 requests/day</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </>
  )
}
