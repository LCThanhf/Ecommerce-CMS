import Image from 'next/image'
import logoIcon from '@/app/assets/logo.png'
import vectorBg from '@/app/assets/Vector.png'
import group19 from '@/app/assets/Group 19.png'

const NetworkDecoration = () => {
  return (
    <>
      <div
        className="pointer-events-none absolute top-[10%] w-[22%]"
        style={{ right: '-4%', filter: 'brightness(0) invert(1)', opacity: 0.55 }}
        aria-hidden="true"
      >
        <Image
          src={group19}
          alt=""
          className="w-full object-contain"
        />
      </div>

      <div
        className="pointer-events-none absolute bottom-0 left-0 w-full opacity-30"
        style={{ mixBlendMode: 'multiply' }}
        aria-hidden="true"
      >
        <Image
          src={vectorBg}
          alt=""
          className="w-full object-fill"
          priority
        />
      </div>
    </>
  )
}

const TopCircle = () => {
  return (
    <div
      className="mx-auto inline-flex h-24 w-24 items-center justify-center rounded-full bg-white/90 shadow-[0_10px_20px_rgba(0,0,0,0.2)]"
      aria-hidden="true"
    >
      <Image src={logoIcon} alt="Website logo" className="h-18 w-18 object-contain" />
    </div>
  )
}

interface AuthLayoutProps {
  children: React.ReactNode
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <main
      className="relative isolate flex min-h-screen items-start justify-center overflow-hidden bg-[#01AEEF] px-4 pb-10 pt-16 text-white sm:items-center sm:pt-10"
    >
      <NetworkDecoration />

      <section className="relative z-10 w-full max-w-150 text-center animate-in fade-in zoom-in-95 duration-500">
        <TopCircle />
        {children}
        <div className="mt-16 space-y-1 text-[13px] text-cyan-50/50">
          <p>
            Nếu bạn có thắc mắc hay cần giải đáp, vui lòng liên hệ số điện thoại: <span className="font-semibold">19001000</span>
          </p>
          <p>Bản quyền thuộc về AnyBim</p>
        </div>
      </section>
    </main>
  )
}
