"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  life: number
  maxLife: number
}

interface MousePosition {
  x: number
  y: number
}

export function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef<MousePosition>({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(true)
  const { theme } = useTheme()

  // Performance optimization: reduce particles on mobile
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768
  const maxParticles = isMobile ? 30 : 60
  const particleCreationRate = isMobile ? 0.3 : 0.5

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    // Click interaction - create burst of particles
    const handleClick = (e: MouseEvent) => {
      const burstCount = isMobile ? 5 : 10
      for (let i = 0; i < burstCount; i++) {
        createParticle(e.clientX, e.clientY, true)
      }
    }

    // Touch support for mobile
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      }
    }

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0]
        const burstCount = 5
        for (let i = 0; i < burstCount; i++) {
          createParticle(touch.clientX, touch.clientY, true)
        }
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("click", handleClick)
    window.addEventListener("touchmove", handleTouchMove, { passive: true })
    window.addEventListener("touchstart", handleTouchStart, { passive: true })

    // Create particle
    const createParticle = (x?: number, y?: number, isBurst = false) => {
      const particle: Particle = {
        x: x ?? Math.random() * canvas.width,
        y: y ?? Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * (isBurst ? 4 : 1),
        vy: (Math.random() - 0.5) * (isBurst ? 4 : 1),
        size: Math.random() * (isBurst ? 8 : 4) + 2,
        opacity: isBurst ? 0.8 : Math.random() * 0.5 + 0.1,
        life: 0,
        maxLife: isBurst ? 60 : Math.random() * 200 + 100,
      }
      particlesRef.current.push(particle)
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Create new particles occasionally
      if (Math.random() < particleCreationRate && particlesRef.current.length < maxParticles) {
        createParticle()
      }

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter((particle) => {
        // Update particle
        particle.life++
        particle.x += particle.vx
        particle.y += particle.vy

        // Mouse interaction - attract particles
        const dx = mouseRef.current.x - particle.x
        const dy = mouseRef.current.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 150) {
          const force = (150 - distance) / 150
          particle.vx += (dx / distance) * force * 0.01
          particle.vy += (dy / distance) * force * 0.01
        }

        // Apply friction
        particle.vx *= 0.99
        particle.vy *= 0.99

        // Fade out over time
        const lifeRatio = particle.life / particle.maxLife
        particle.opacity = Math.max(0, particle.opacity * (1 - lifeRatio * 0.02))

        // Draw particle
        ctx.save()
        ctx.globalAlpha = particle.opacity

        // Color based on theme
        const isDark = theme === "dark"
        const baseColor = isDark ? "255, 255, 255" : "59, 130, 246" // white for dark, blue for light

        // Create gradient for particle
        const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.size)
        gradient.addColorStop(0, `rgba(${baseColor}, ${particle.opacity})`)
        gradient.addColorStop(1, `rgba(${baseColor}, 0)`)

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()

        // Remove dead particles
        return particle.life < particle.maxLife && particle.opacity > 0.01
      })

      // Draw connections between nearby particles
      if (!isMobile) {
        drawConnections(ctx)
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    // Draw connections between particles
    const drawConnections = (ctx: CanvasRenderingContext2D) => {
      const particles = particlesRef.current
      const isDark = theme === "dark"
      const connectionColor = isDark ? "255, 255, 255" : "59, 130, 246"

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            const opacity = ((100 - distance) / 100) * 0.1
            ctx.save()
            ctx.globalAlpha = opacity
            ctx.strokeStyle = `rgba(${connectionColor}, ${opacity})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
            ctx.restore()
          }
        }
      }
    }

    // Start animation
    animate()

    // Visibility API for performance
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden)
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("click", handleClick)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("touchstart", handleTouchStart)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [theme, isMobile, maxParticles, particleCreationRate])

  // Pause animation when not visible
  useEffect(() => {
    if (!isVisible && animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
  }, [isVisible])

  return (
    <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ background: "transparent" }} />
  )
}
