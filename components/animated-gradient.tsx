"use client"

import { useEffect, useRef } from "react"

export default function AnimatedGradient() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Create gradient points
    const gradientPoints = [
      { x: canvas.width * 0.2, y: canvas.height * 0.3, radius: canvas.width * 0.5, color: "rgba(192, 132, 252, 0.15)" }, // Purple
      { x: canvas.width * 0.8, y: canvas.height * 0.7, radius: canvas.width * 0.5, color: "rgba(244, 114, 182, 0.15)" }, // Pink
      { x: canvas.width * 0.5, y: canvas.height * 0.5, radius: canvas.width * 0.4, color: "rgba(147, 197, 253, 0.1)" }, // Light blue
    ]

    // Animation variables
    let animationFrameId: number
    let time = 0

    // Animation function
    const animate = () => {
      time += 0.002 // Slower animation

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update gradient positions with more organic movement
      gradientPoints.forEach((point, index) => {
        const offset = index * ((Math.PI * 2) / 3)
        point.x = canvas.width * (0.5 + 0.3 * Math.sin(time + offset))
        point.y = canvas.height * (0.5 + 0.2 * Math.cos(time * 1.3 + offset))
      })

      // Draw gradients
      gradientPoints.forEach((point) => {
        const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, point.radius)

        gradient.addColorStop(0, point.color)
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)")

        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" style={{ opacity: 1 }} />
}
