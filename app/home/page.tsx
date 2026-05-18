'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()
  return (
    <main className="min-h-screen bg-white flex flex-col relative overflow-hidden">

      <motion.div
        className="absolute right-0 top-0 h-full pointer-events-none"
        style={{
          width: '12vw',
          background: 'white',
          borderRadius: '50% 0 0 50%',
          boxShadow: '-8px 0 20px rgba(0,0,0,0.06)',
          zIndex: 2,
        }}
        animate={{ x: ['0vw', '-200vw', '0vw'] }}
        transition={{ 
          duration: 5, 
          times: [0, 0.92, 1],
          ease: 'easeInOut',
          repeat: Infinity,
          repeatDelay: 0
        }}
      />
      <header className="absolute top-13 left-15 z-30 cursor-pointer"
          onClick={() => router.push('/dashboard')}>
        <Image src="/Imagologo_motion.svg"
          alt="Motion Logo" 
          width={55} 
          height={55} 
          loading="eager"
          className="object-contain" 
          style={{ width: '60px', height: 'auto'}}
          />
        
          
      </header>

      <section className="relative flex items-center justify-center overflow-hidden" style={{ height: 'calc(100vh - 100px)', zIndex: 3 }}>

        {/* "BIENVENIDO A" — detrás del teléfono */}
        <motion.h1
          className="absolute z-10 text-center text-[6.5vw] text-[#00249C] leading-none tracking-tighter top-[44%] w-full px-8"
          style={{ 
            fontFamily: 'var(--font-montserrat)', 
            fontWeight: 650,
            fontStretch: 'condensed',
            WebkitTextStroke: '1px white',
            paintOrder: 'stroke fill'
          }}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0 }}
        >
          BIENVENIDO A
        </motion.h1>

        {/* Teléfono — capa del medio */}
        <motion.div
          className="absolute z-20 cursor-pointer"
          style={{ marginTop: '80px' }}
          onClick={() => router.push('/dashboard')}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0 }}
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Image
              src="/Telefono-01.png"
              alt="Dispositivo Monitoring Innovation"
              width={600}
              height={600}
              className="object-contain"
              style={{ width: '65vh', height: 'auto', marginTop: '5vh' }}
              priority
            />

          </motion.div>
        </motion.div>

        {/* "MONITORING INNOVATION" — adelante del teléfono */}
        <motion.h2
          className="absolute z-30 text-center text-[4.5vw] text-[#00249C] leading-none tracking-tighter top-[58%] w-full px-8"
          style={{ 
            fontFamily: 'var(--font-montserrat)', 
            fontWeight: 700,
            fontStretch: 'condensed',
            WebkitTextStroke: '5px white',
            paintOrder: 'stroke fill'
          }}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0 }}
        >
          MONITORING INNOVATION
        </motion.h2>


      </section>

      <motion.footer
        className="w-full py-5 flex justify-between items-center"
        style={{ paddingLeft: '21%', paddingRight: '21%', paddingTop: '2%', zIndex: 3, position: 'relative' }}
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0 }}
      >
        <NavLink href="https://monitoringinnovation.com/" label="MONITORINGINNOVATION" />
        <NavLink href="https://gpscontrol.co/"            label="GPS CONTROL" />
        <NavLink href={process.env.NEXT_PUBLIC_FRONTEND_REPO || '#'} label="Link repo front" />
        <NavLink href={process.env.NEXT_PUBLIC_BACKEND_REPO  || '#'} label="Link repo back" />
      </motion.footer>
    </main>
  )
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-base font-semibold text-[#40CEE4] hover:text-[#C6007E] transition-colors tracking-wider whitespace-nowrap"
      style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 600 }}
      whileHover={{ scale: 1.05 }}
    >
      {label}
    </motion.a>
  )
}