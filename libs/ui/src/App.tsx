// Punto de entrada del playground de Vite para desarrollar componentes de la
// librería de UI de forma aislada. La aplicación real es apps/web (Next.js),
// que consume estos componentes directamente desde el código fuente.
export const App = () => {
  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold">SupplyChainX · Librería de UI</h1>
      <p className="text-sm text-gray-600">
        Esta es la librería de componentes compartidos. La aplicación se ejecuta
        en <code>apps/web</code>.
      </p>
    </div>
  )
}

export default App
