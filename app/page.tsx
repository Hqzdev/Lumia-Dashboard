"use client"

import { useState, useCallback, useEffect } from "react"
import { Activity, Brain, Clock, Cpu, Database, Maximize2, RefreshCw, Server, GitBranch, GitCommit, Shield } from "lucide-react"
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

interface DeploymentData {
  id: string
  status: string
  environment: string
  created_at: string
  description: string
}

interface FirewallData {
  allTraffic: number;
  allowed: number;
  denied: number;
  challenged: number;
  logged: number;
  rateLimited: number;
}

export default function Dashboard() {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [deployments, setDeployments] = useState<DeploymentData[]>([])
  const [firewallData, setFirewallData] = useState<FirewallData>({
    allTraffic: 117,
    allowed: 104,
    denied: 0,
    challenged: 13,
    logged: 0,
    rateLimited: 0
  })
  const [projectStatus, setProjectStatus] = useState({
    deployment: { 
      status: 'ready', 
      environment: 'production',
      creator: 'hqzdev',
      createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
      url: 'https://vercel.com/ha1zyys-projects/lumia-ai/deployments'
    },
    buildTime: '0s',
    framework: 'Next.js',
    domain: { status: 'active' },
    ssl: { valid: true }
  })
  const [logs, setLogs] = useState<Array<{
    id: string;
    timestamp: string;
    message: string;
    type: 'info' | 'error' | 'warning';
  }>>([])

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

  const fetchDeployments = async () => {
    try {
      const response = await fetch('https://api.github.com/repos/Hqzdev/LumiaAI/deployments', {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
          'X-GitHub-Api-Version': '2022-11-28'
        }
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setDeployments(data.slice(0, 5)) // Get latest 5 deployments
      return Promise.resolve()
    } catch (error) {
      console.error('Error fetching deployments:', error)
      toast({
        title: "Error fetching deployments",
        description: "Could not load deployment data. Please try again later.",
        variant: "destructive"
      })
      return Promise.reject(error)
    }
  }

  const fetchFirewallData = async () => {
    try {
      const response = await fetch('https://api.vercel.com/v1/firewall/stats', {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_VERCEL_TOKEN}`,
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setFirewallData({
        allTraffic: data.allTraffic || 0,
        allowed: data.allowed || 0,
        denied: data.denied || 0,
        challenged: data.challenged || 0,
        logged: data.logged || 0,
        rateLimited: data.rateLimited || 0
      });
      return Promise.resolve()
    } catch (error) {
      console.error('Error fetching firewall data:', error);
      return Promise.reject(error)
    }
  };

  const fetchProjectStatus = async () => {
    try {
      const response = await fetch('https://api.vercel.com/v6/deployments', {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_VERCEL_TOKEN}`,
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const latestDeployment = data.deployments[0];
      
      setProjectStatus(prev => ({
        ...prev,
        deployment: {
          status: latestDeployment.state,
          environment: latestDeployment.target,
          creator: latestDeployment.creator?.username || 'hqzdev',
          createdAt: latestDeployment.createdAt,
          url: `https://vercel.com/${latestDeployment.creator?.username || 'hqzdev'}/lumia-dashboard/deployment/${latestDeployment.uid}`
        },
        buildTime: `${Math.round((latestDeployment.buildingAt - latestDeployment.createdAt) / 1000)}s`,
      }));
      return Promise.resolve()
    } catch (error) {
      console.error('Error fetching project status:', error);
      toast({
        title: "Error fetching project status",
        description: "Could not load project status. Please try again later.",
        variant: "destructive"
      });
      return Promise.reject(error)
    }
  };

  const fetchLogs = async () => {
    try {
      const response = await fetch('https://api.vercel.com/v2/deployments/logs', {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_VERCEL_TOKEN}`,
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setLogs(data.logs || []);
      return Promise.resolve()
    } catch (error) {
      console.error('Error fetching logs:', error);
      toast({
        title: "Error fetching logs",
        description: "Could not load logs data. Please try again later.",
        variant: "destructive"
      });
      return Promise.reject(error)
    }
  };

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);

    try {
      // Fetch all data simultaneously
      await Promise.allSettled([
        fetchDeployments(),
        fetchFirewallData(),
        fetchProjectStatus(),
        fetchLogs()
      ]);

      toast({
        title: "Dashboard refreshed",
        description: "All metrics have been updated with the latest data.",
      });
    } catch (error) {
      console.error('Error during refresh:', error);
      toast({
        title: "Refresh failed",
        description: "Some data could not be updated. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchFirewallData();
    const interval = setInterval(fetchFirewallData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchDeployments();
    const interval = setInterval(fetchDeployments, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchProjectStatus();
    const interval = setInterval(fetchProjectStatus, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

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
                    className="bg-blue-600 hover:bg-blue-700 rounded-xl transition-all "
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
                  <Card className="bg-white/90 backdrop-blur-sm border-2 border-gray-200 rounded-2xl transition-all">
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
                  <Card className="bg-white/90 backdrop-blur-sm border-2 border-gray-200 rounded-2xl transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Project Status</CardTitle>
                      <div className="flex items-center gap-2">
                        <Link 
                          href={projectStatus.deployment.url}
                          target="_blank"
                          className="hover:text-blue-600 transition-colors"
                        >
                          <Maximize2 className="h-4 w-4 text-blue-500" />
                        </Link>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px] w-full bg-blue-50/50 rounded-md flex flex-col items-center justify-center p-4">
                        <div className="w-full space-y-4">
                          <div className="space-y-2">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">Status</span>
                                <span className={`text-sm font-medium ${
                                  projectStatus.deployment.status === 'ready' ? 'text-green-600' :
                                  projectStatus.deployment.status === 'building' ? 'text-yellow-600' :
                                  projectStatus.deployment.status === 'error' ? 'text-red-600' :
                                  'text-blue-600'
                                }`}>
                                  {projectStatus.deployment.status === 'ready' ? 'Ready' :
                                   projectStatus.deployment.status === 'building' ? 'Building' :
                                   projectStatus.deployment.status === 'error' ? 'Error' :
                                   'Loading'}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">Created</span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(projectStatus.deployment.createdAt).getTime() > 0 
                                    ? `${Math.floor((Date.now() - new Date(projectStatus.deployment.createdAt).getTime()) / 60000)}m ago`
                                    : '...'} by <span className="text-blue-600">{projectStatus.deployment.creator}</span>
                                </span>
                              </div>
                            </div>
                            <div className="h-2 w-full bg-green-100 rounded-full overflow-hidden">
                              <div className={`h-full ${
                                projectStatus.deployment.status === 'ready' ? 'bg-green-600' :
                                projectStatus.deployment.status === 'building' ? 'bg-yellow-600' :
                                projectStatus.deployment.status === 'error' ? 'bg-red-600' :
                                'bg-blue-600'
                              } w-[100%]`} />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">Build Time</span>
                                <span className="text-xs text-blue-600">{projectStatus.buildTime}</span>
                              </div>
                              <div className="h-1.5 w-full bg-blue-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-600 w-[45%]" />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">Framework</span>
                                <span className="text-xs text-blue-600">{projectStatus.framework}</span>
                              </div>
                              <div className="h-1.5 w-full bg-blue-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-600 w-[100%]" />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">Domain</span>
                                <span className={`text-xs ${
                                  projectStatus.domain.status === 'active' ? 'text-green-600' :
                                  projectStatus.domain.status === 'pending' ? 'text-yellow-600' :
                                  'text-blue-600'
                                }`}>
                                  {projectStatus.domain.status === 'active' ? 'Active' : 'Pending'}
                                </span>
                              </div>
                              <div className="h-1.5 w-full bg-blue-100 rounded-full overflow-hidden">
                                <div className={`h-full ${
                                  projectStatus.domain.status === 'active' ? 'bg-green-600' :
                                  projectStatus.domain.status === 'pending' ? 'bg-yellow-600' :
                                  'bg-blue-600'
                                } w-[100%]`} />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">SSL</span>
                                <span className={`text-xs ${projectStatus.ssl.valid ? 'text-green-600' : 'text-red-600'}`}>
                                  {projectStatus.ssl.valid ? 'Valid' : 'Invalid'}
                                </span>
                              </div>
                              <div className="h-1.5 w-full bg-blue-100 rounded-full overflow-hidden">
                                <div className={`h-full ${projectStatus.ssl.valid ? 'bg-green-600' : 'bg-red-600'} w-[100%]`} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card className="bg-white/90 backdrop-blur-sm border-2 border-gray-200 rounded-2xl transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Logs</CardTitle>
                      <div className="flex items-center gap-2">
                        <Link 
                          href="https://vercel.com/ha1zyys-projects/lumia-ai/logs"
                          target="_blank"
                          className="hover:text-blue-600 transition-colors"
                        >
                          <Maximize2 className="h-4 w-4 text-blue-500" />
                        </Link>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px] w-full bg-blue-50/50 rounded-md overflow-auto p-4">
                        <div className="space-y-2">
                          {logs.length > 0 ? (
                            logs.map((log) => (
                              <div
                                key={log.id}
                                className="flex items-start gap-2 text-xs animate-fade-in"
                              >
                                <span className={`mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0 ${
                                  log.type === 'error' ? 'bg-red-500' :
                                  log.type === 'warning' ? 'bg-yellow-500' :
                                  'bg-blue-500'
                                }`} />
                                <div className="space-y-1 w-full">
                                  <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">
                                      {new Date(log.timestamp).toLocaleTimeString()}
                                    </span>
                                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                                      log.type === 'error' ? 'bg-red-100 text-red-700' :
                                      log.type === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                                      'bg-blue-100 text-blue-700'
                                    }`}>
                                      {log.type}
                                    </span>
                                  </div>
                                  <p className="text-sm text-foreground break-all">
                                    {log.message}
                                  </p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="h-full flex items-center justify-center text-blue-600">
                              Loading logs...
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/90 backdrop-blur-sm border-2 border-gray-200 rounded-2xl transition-all">
                    <Dialog>
                      <DialogTrigger asChild>
                        <div className="cursor-pointer">
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Firewall</CardTitle>
                            <Maximize2 className="h-4 w-4 text-blue-500" />
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">All Traffic</span>
                                    <span className="text-xs text-blue-600">{firewallData.allTraffic}</span>
                                  </div>
                                  <div className="h-1.5 w-full bg-blue-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-600 w-[85%]" />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">Allowed</span>
                                    <span className="text-xs text-green-600">{firewallData.allowed}</span>
                                  </div>
                                  <div className="h-1.5 w-full bg-green-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-600" style={{ width: `${(firewallData.allowed/firewallData.allTraffic)*100}%` }} />
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-yellow-600">Challenged: {firewallData.challenged}</span>
                                <span className="text-red-600">Denied: {firewallData.denied}</span>
                              </div>
                            </div>
                          </CardContent>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[725px] bg-white/95 backdrop-blur-md rounded-2xl border-2 border-gray-200">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-blue-500" />
                            Firewall Statistics
                          </DialogTitle>
                          <DialogDescription>
                            Detailed firewall traffic and security metrics
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6">
                          <div className="grid grid-cols-3 gap-4">
                            <Card className="bg-white/80">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-sm">All Traffic</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="text-2xl font-bold text-blue-600">{firewallData.allTraffic}</div>
                              </CardContent>
                            </Card>
                            <Card className="bg-white/80">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Allowed</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="text-2xl font-bold text-green-600">{firewallData.allowed}</div>
                              </CardContent>
                            </Card>
                            <Card className="bg-white/80">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Challenged</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="text-2xl font-bold text-yellow-600">{firewallData.challenged}</div>
                              </CardContent>
                            </Card>
                          </div>
                          <Card className="bg-white/80">
                            <CardHeader>
                              <CardTitle className="text-sm">Traffic Overview</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="h-[200px] w-full bg-blue-50/50 rounded-md">
                                {/* Here you can add a chart component to show traffic over time */}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </Card>
                  <Card className="bg-white/90 backdrop-blur-sm border-2 border-gray-200 rounded-2xl transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Deployments</CardTitle>
                      <div className="flex items-center gap-2">
                        <GitBranch className="h-4 w-4 text-blue-500" />
                        <Maximize2 className="h-4 w-4 text-blue-500" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {deployments.length > 0 ? (
                          deployments.map((deployment) => (
                            <div
                              key={deployment.id}
                              className="flex items-center justify-between p-2 rounded-lg bg-blue-50/50"
                            >
                              <div className="flex items-center gap-2">
                                <GitCommit className="h-4 w-4 text-blue-500" />
                                <div>
                                  <div className="text-sm font-medium">{deployment.environment}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {new Date(deployment.created_at).toLocaleString()}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  deployment.status === 'success' ? 'bg-green-100 text-green-700' :
                                  deployment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                  deployment.status === 'failure' ? 'bg-red-100 text-red-700' :
                                  'bg-blue-100 text-blue-700'
                                }`}>
                                  {deployment.status}
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="h-[100px] w-full bg-blue-50/50 rounded-md flex items-center justify-center text-blue-600">
                            Loading deployment data...
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="models" className="space-y-4">
                <Card className="bg-white/90 backdrop-blur-sm border-2 border-gray-200 rounded-2xl transition-all">
                  <CardHeader>
                    <CardTitle>AI Models</CardTitle>
                    <CardDescription>Overview of deployed AI models and their performance.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {["Lumia V2", "Lumia V1 Max", "Lumia V2 Pro"].map((model, index) => (
                        <Card
                          key={model}
                          className="bg-white/80 border-2 border-gray-200 rounded-2xl transition-all hover:border-blue-200 animate-slide-in"
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
