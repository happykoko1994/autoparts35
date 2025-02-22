import { Geist, Geist_Mono } from "next/font/google";
import { FaPhoneAlt, FaWhatsapp, FaVk } from "react-icons/fa";
import "./globals.css";
import { Manrope } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"], // поддержка кириллицы
  weight: ["300", "400", "500", "600", "700"], // нужные толщины
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Автозапчасти Mitsubishi, Toyota, VAG в Санкт-Петербурге – В наличии и под заказ",
  description:
    "Широкий выбор оригинальных и аналоговых автозапчастей для Mitsubishi, Toyota, Volkswagen, Skoda в Санкт-Петербурге. Доставка и самовывоз.",
  keywords:
    "автозапчасти Колпино, автозапчасти Пушкин, автозапчасти Московская Славянка, автозапчасти СПб, запчасти для иномарок, купить автозапчасти, автозапчасти Mitsubishi, запчасти Toyota, запчасти VAG, детали Volkswagen, Skoda",
  author: "Автомагазин СПб",
  openGraph: {
    title: "Автозапчасти для иномарок в Московской Славянке",
    description:
      "Лучший выбор автозапчастей в Санкт-Петербурге. В наличии и под заказ.",
    type: "website",
    url: "https://autoparts35.vercel.app/",
    images: [
      {
        url: "https://autoparts35.vercel.app/mitsubishi.png",
        alt: "Автозапчасти Mitsubishi",
      },
    ],
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoPartsStore",
    "name": "Автозапчасти для иномарок",
    "image": "https://autoparts35.vercel.app/mitsubishi.png",
    "telephone": "+7 (812) 244-28-73",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Московская Славянка, 17А, Торговый центр, этаж 2, павильон №35",
      "addressLocality": "Санкт-Петербург",
      "addressCountry": "RU"
    },
    "url": "https://autoparts35.vercel.app/",
    "openingHours": "Mo-Fr 10:00-19:00, Sa-Su 10:00-18:00"
  };
  return (
    <html lang="ru">
      <head>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta name="author" content={metadata.author} />
        <meta property="og:title" content={metadata.openGraph.title} />
        <meta
          property="og:description"
          content={metadata.openGraph.description}
        />
        <meta property="og:type" content={metadata.openGraph.type} />
        <meta property="og:url" content={metadata.openGraph.url} />
        <meta property="og:image" content={metadata.openGraph.images[0].url} />
        <meta property="og:image:alt" content="Автозапчасти Mitsubishi" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <title>Автозапчасти для иномарок в Московской Славянке</title>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <header className="w-full bg-gray-100 border-b border-gray-300 py-4 px-6 justify-end items-center fixed hidden md:flex">
          <div className="flex flex-col">
            <div className="flex items-center space-x-3">
              <FaPhoneAlt className="text-gray-600" />
              <p className="text-black hover:text-gray-700">
                +7 (812) 244-28-73
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <FaWhatsapp className="text-green-600 w-16px h-16px" />
              <p className="text-black hover:text-gray-700">
                +7 (953) 351-08-50
              </p>
            </div>
          </div>
        </header>

        <main className="flex-grow flex flex-col">{children}</main>

        {/* <footer className="w-full bg-gray-100 border-t border-gray-300 py-1 flex flex-col items-center fixed bottom-0">
          <p className="mb-2">Мы в социальных сетях:</p>
          <a
            href="https://vk.com/club78660843"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700"
          >
            <FaVk className="w-6 h-6" />
          </a>
        </footer> */}
      </body>
    </html>
  );
}
