"use client"

import { ArrowDown, ArrowUp, type LucideIcon } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Add animation keyframes
const animateFadeIn = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.5s ease-out forwards;
  }
`

interface MetricProps {
  id: string
  title: string
  description: string
  value: string
  change: string
  historical: string
  icon: LucideIcon
  color: string
}

interface AIMetricCardProps {
  metric: MetricProps
}

export function AIMetricCard({ metric }: AIMetricCardProps) {
  const isPositiveChange = metric.change.startsWith("+")
  const isNeutralChange = metric.change === "0%"

  return (
    <>
      <style jsx global>
        {animateFadeIn}
      </style>
      <Card
        className="overflow-hidden transition-all hover:shadow-lg hover:scale-105 cursor-pointer bg-white/90 backdrop-blur-sm border-2 border-gray-200 rounded-2xl animate-fade-in"
        style={{ animationDelay: `${Number.parseInt(metric.id.charAt(0), 36) * 100}ms` }}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
          <metric.icon className={`h-4 w-4 ${metric.color}`} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metric.value}</div>
          <CardDescription className="flex items-center pt-1">
            {!isNeutralChange && (
              <>
                {isPositiveChange ? (
                  <ArrowUp className="mr-1 h-4 w-4 text-blue-500" />
                ) : (
                  <ArrowDown className="mr-1 h-4 w-4 text-blue-500" />
                )}
                <span className={isPositiveChange ? "text-blue-500" : "text-blue-500"}>{metric.change}</span>
              </>
            )}
            {isNeutralChange && <span className="text-muted-foreground">{metric.change}</span>}
            <span className="ml-1 text-muted-foreground">{metric.description}</span>
          </CardDescription>
          <div className="mt-2 flex items-center text-xs text-muted-foreground">
            {metric.historical.startsWith("↑") ? (
              <ArrowUp className="mr-1 h-3 w-3 text-green-500" />
            ) : metric.historical.startsWith("↓") ? (
              <ArrowDown className="mr-1 h-3 w-3 text-red-500" />
            ) : null}
            <span className={metric.historical.startsWith("↑") ? "text-green-500" : metric.historical.startsWith("↓") ? "text-red-500" : "text-muted-foreground"}>
              {metric.historical}
            </span>
          </div>
          <div className="mt-3 h-[60px] w-full">
            <MetricGraph metricId={metric.id} />
          </div>
        </CardContent>
      </Card>
    </>
  )
}

function MetricGraph({ metricId }: { metricId: string }) {
  // This would be replaced with actual chart implementation
  // For now, we'll use placeholder colored bars to simulate graphs

  if (metricId === "latency") {
    return (
      <div className="flex h-full items-end space-x-1">
        {[40, 30, 35, 45, 25, 42, 38].map((height, i) => (
          <div key={i} className="bg-blue-500/20 rounded-t w-full" style={{ height: `${height}%` }} />
        ))}
      </div>
    )
  }

  if (metricId === "throughput") {
    return (
      <div className="flex h-full items-end space-x-1">
        {[50, 60, 70, 65, 80, 75, 85].map((height, i) => (
          <div key={i} className="bg-blue-600/20 rounded-t w-full" style={{ height: `${height}%` }} />
        ))}
      </div>
    )
  }

  if (metricId === "accuracy") {
    return (
      <div className="flex h-full items-end space-x-1">
        {[90, 92, 91, 93, 95, 94, 98].map((height, i) => (
          <div key={i} className="bg-blue-700/20 rounded-t w-full" style={{ height: `${height}%` }} />
        ))}
      </div>
    )
  }

  if (metricId === "resources") {
    return (
      <div className="flex h-full items-end space-x-1">
        {[60, 65, 70, 75, 72, 78, 76].map((height, i) => (
          <div key={i} className="bg-blue-800/20 rounded-t w-full" style={{ height: `${height}%` }} />
        ))}
      </div>
    )
  }

  if (metricId === "availability") {
    return (
      <div className="flex h-full items-end space-x-1">
        {[98, 99, 100, 99, 100, 100, 100].map((height, i) => (
          <div key={i} className="bg-blue-900/20 rounded-t w-full" style={{ height: `${height}%` }} />
        ))}
      </div>
    )
  }

  return null
}
