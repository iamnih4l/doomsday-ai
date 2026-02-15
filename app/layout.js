import './globals.css'

export const metadata = {
  title: 'Global Risk Clock - AI-Driven Real-Time Risk Assessment',
  description: 'An AI-driven real-time assessment of humanity\'s global risk level, inspired by the Doomsday Clock.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{__html:'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);'}} />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
