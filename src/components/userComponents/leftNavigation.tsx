import { motion } from "framer-motion"
import { User, Calendar, Wrench, Plus, LogOut } from "lucide-react"
import { Button } from '@mui/material'

export type ActiveSection = "profile" | "appointments" | "equipment" | "book-appointment"

interface LeftNavigationProps {
  activeSection: ActiveSection
  onSectionChange: (section: ActiveSection) => void
}

const navigationItems = [
  { id: "profile" as const, label: "Profil", icon: User },
  { id: "appointments" as const, label: "Moje wizyty", icon: Calendar },
  { id: "equipment" as const, label: "Uzbębienie", icon: Wrench },
  { id: "book-appointment" as const, label: "Umów wizytę", icon: Plus },
]

export default function LeftNavigation({ activeSection, onSectionChange }: LeftNavigationProps) {
  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      
    >
      <div className="p-6">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
         
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <h1 className="text-2xl font-bold text-white">DentalCare</h1>
            <p className="text-blue-100 text-sm">Panel Pacjenta</p>
          </div>
        </motion.div>

        {/* Navigation Items */}
        <nav className="space-y-2">
          {navigationItems.map((item, index) => {
            const Icon = item.icon
            const isActive = activeSection === item.id

            return (
              <motion.div
                key={item.id}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index }}
              >
                <Button
                  
                  className={`w-full justify-start text-left p-4 h-auto transition-all duration-300 ${
                    isActive
                      ? "bg-white text-blue-700 shadow-lg transform scale-105"
                      : "text-white hover:bg-white/10 hover:text-white"
                  }`}
                  onClick={() => onSectionChange(item.id)}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Button>
              </motion.div>
            )
          })}
        </nav>
      </div>

      {/* Bottom Section */}
    
      <div className="absolute bottom-6 left-6 right-6">
        <Button  className="w-full justify-start text-white hover:bg-white/10 p-4">
          <LogOut className="mr-3 h-5 w-5" />
          Wyloguj się
        </Button>
      </div>
    </motion.div>
  )
}

export { LeftNavigation }
