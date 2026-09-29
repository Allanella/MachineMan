import { Footer, Navbar, SectionHeading, ContactForm, CTASection } from '@/components/site'
import { address, email, phone, whatsapp } from '@/lib/site-data'
import { MessageCircle, Phone, Mail, MapPin, Share2 } from 'lucide-react'

export const metadata = { 
  title: 'Contact Machine Man | Kampala, Uganda',
  description: 'Get in touch with Machine Man Kampala for equipment inquiries, sales, and support.'
}

export default function ContactPage() { 
  const tiktokUrl = 'https://www.tiktok.com/@machineman488?is_from_webapp=1&sender_device=pc'

  return (
    <>
      <Navbar />
      <main className="pt-32">
        <section className="mx-auto max-w-7xl px-5 pb-24 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            
            {/* LEFT COLUMN: CONTACT DETAILS & SOCIALS */}
            <div className="flex flex-col justify-between space-y-8">
              <div>
                <SectionHeading 
                  eyebrow="Get in touch" 
                  title="Let&apos;s talk machines." 
                  text="Visit our showroom along Nabugabo Road or reach out directly through WhatsApp, TikTok, or phone for quick responses." 
                />

                {/* DIRECT QUICK CONTACT BUTTONS */}
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <a 
                    href={whatsapp} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center gap-3 border border-[#25D366]/30 bg-[#25D366]/10 p-4 transition hover:bg-[#25D366] hover:text-white group"
                  >
                    <div className="grid h-10 w-10 place-items-center bg-[#25D366] text-white group-hover:bg-white group-hover:text-[#25D366]">
                      <MessageCircle size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Chat directly</p>
                      <p className="text-sm font-black">WhatsApp Us</p>
                    </div>
                  </a>

                  <a 
                    href={tiktokUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center gap-3 border border-black/20 bg-black/5 p-4 transition hover:bg-black hover:text-white group"
                  >
                    <div className="grid h-10 w-10 place-items-center bg-black text-white group-hover:bg-white group-hover:text-black">
                      <Share2 size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Follow our videos</p>
                      <p className="text-sm font-black">TikTok @machineman488</p>
                    </div>
                  </a>
                </div>

                {/* DETAILED CONTACT LIST */}
                <div className="mt-10 space-y-6 border-t border-black/10 pt-8 text-sm">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 grid h-8 w-8 shrink-0 place-items-center bg-[#f3f3f1] text-[#b27f19]">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <strong className="block text-xs font-bold uppercase tracking-wider text-[#111]">Location / Address</strong>
                      <span className="mt-1 block leading-relaxed text-[#5c5e60]">{address}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="mt-1 grid h-8 w-8 shrink-0 place-items-center bg-[#f3f3f1] text-[#b27f19]">
                      <Phone size={18} />
                    </div>
                    <div>
                      <strong className="block text-xs font-bold uppercase tracking-wider text-[#111]">Phone & WhatsApp</strong>
                      <a href={`tel:${phone}`} className="mt-1 block font-medium text-[#111] transition hover:text-[#b27f19]">
                        {phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="mt-1 grid h-8 w-8 shrink-0 place-items-center bg-[#f3f3f1] text-[#b27f19]">
                      <Mail size={18} />
                    </div>
                    <div>
                      <strong className="block text-xs font-bold uppercase tracking-wider text-[#111]">Email Address</strong>
                      <a href={`mailto:${email}`} className="mt-1 block font-medium text-[#111] transition hover:text-[#b27f19]">
                        {email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* STORE HOURS BANNER */}
              <div className="border border-black/10 bg-[#f9f9f8] p-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#b27f19]">Working Hours</p>
                <p className="mt-1 text-xs font-bold text-[#111]">Monday – Saturday: 8:00 AM – 6:00 PM EAT</p>
                <p className="text-xs text-[#777]">Sunday: Closed</p>
              </div>
            </div>

            {/* RIGHT COLUMN: INQUIRY FORM */}
            <div className="border border-black/10 bg-white p-8 shadow-sm md:p-12">
              <p className="eyebrow text-[#b27f19]">Send an inquiry</p>
              <h2 className="mt-2 mb-8 text-3xl font-black tracking-tight">Tell us what equipment you need.</h2>
              <ContactForm />
            </div>

          </div>
        </section>
        <CTASection />
      </main>
      <Footer />
    </>
  ) 
}