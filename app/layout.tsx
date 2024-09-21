"use client"

import './globals.css'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { Moon, Sun, Facebook, Twitter, Instagram, Linkedin, ChevronUp } from "lucide-react"
import { Player } from "@lottiefiles/react-lottie-player"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setIsDarkMode(true)
    }
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    if (!isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <html lang="en">
      <body className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-[#022d2d] text-white' : 'bg-gray-100 text-gray-900'} transition-colors duration-300`}>
        <header className="w-full mb-4">
          <Card className="rounded-none shadow-md bg-white">
            <CardContent className="p-0">
              <div className="lpbLottiePlayer">
                <a href="https://payfast.io/blog/payfast-is-network" target="_self" rel="noreferrer">
                  <Player
                    src="/animations/payfast_network_banner.json"
                    autoplay
                    loop
                    style={{ width: '100%', height: '65px' }}
                  />
                </a>
              </div>
            </CardContent>
          </Card>
        </header>
        <div className="container mx-auto px-4 pb-8 flex-grow">
          <div className="py-4 flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="rounded-full"
            >
              {isDarkMode ? (
                <Sun className="h-6 w-6 text-yellow-400" />
              ) : (
                <Moon className="h-6 w-6 text-gray-400" />
              )}
              <span className="sr-only">Toggle dark mode</span>
            </Button>
          </div>
          {children}
        </div>
        {/* Desktop Footer */}
        <footer className={`hidden md:block mt-auto ${isDarkMode ? 'bg-[#022d2d] text-white' : 'bg-white text-gray-600'}`}>
          <div className="container mx-auto px-4 py-8">
            <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} pt-8 flex justify-between items-center`}>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-gray-400 transition-colors duration-300">
                  <Facebook size={24} />
                </a>
                <a href="#" className="hover:text-gray-400 transition-colors duration-300">
                  <Twitter size={24} />
                </a>
                <a href="#" className="hover:text-gray-400 transition-colors duration-300">
                  <Instagram size={24} />
                </a>
                <a href="#" className="hover:text-gray-400 transition-colors duration-300">
                  <Linkedin size={24} />
                </a>
              </div>
              <div className="text-sm">
                © 2024 PayFast. All rights reserved.
              </div>
            </div>
          </div>
        </footer>

        {/* Mobile Footer */}
        <footer className={`md:hidden mt-auto ${isDarkMode ? 'bg-[#022d2d] text-white' : 'bg-white text-gray-600'}`}>
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col items-center space-y-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={scrollToTop}
                className="flex items-center space-x-2"
              >
                <ChevronUp size={20} />
                <span>Back to top</span>
              </Button>
              <div className="flex space-x-6">
                <a href="#" className="hover:text-gray-400 transition-colors duration-300">
                  <Facebook size={20} />
                </a>
                <a href="#" className="hover:text-gray-400 transition-colors duration-300">
                  <Twitter size={20} />
                </a>
                <a href="#" className="hover:text-gray-400 transition-colors duration-300">
                  <Instagram size={20} />
                </a>
                <a href="#" className="hover:text-gray-400 transition-colors duration-300">
                  <Linkedin size={20} />
                </a>
              </div>
              <div className="text-xs text-center">
                © 2024 PayFast. All rights reserved.
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}